import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
import matplotlib.patches as patches

class PatternExtractor:
    def __init__(self):
        """
        Initialize pattern extractor
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Transform to prepare image for model
        self.transform = transforms.Compose([
            transforms.ToTensor(),
        ])
    
    def load_image(self, image_path):
        """
        Load and preprocess image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Preprocessed image tensor
        """
        # Load image
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image).to(self.device)
        
        return image_tensor, image
    
    def extract_silhouette(self, image_tensor):
        """
        Extract silhouette from image
        
        Args:
            image_tensor: Image tensor
            
        Returns:
            Binary silhouette mask
        """
        # Convert to grayscale
        grayscale = (0.299 * image_tensor[0] + 0.587 * image_tensor[1] + 0.114 * image_tensor[2])
        
        # Simple thresholding to extract silhouette
        # This is a simplified approach; a real implementation would use a more sophisticated segmentation model
        threshold = 0.9
        silhouette = (grayscale < threshold).float()
        
        # Remove small noise using morphological operations
        kernel_size = 3
        kernel = torch.ones(kernel_size, kernel_size, device=self.device)
        silhouette = self.morphological_operations(silhouette, kernel)
        
        return silhouette
    
    def morphological_operations(self, mask, kernel):
        """
        Apply morphological operations to clean up mask
        
        Args:
            mask: Binary mask
            kernel: Structuring element kernel
            
        Returns:
            Cleaned mask
        """
        # Implement simplified erosion and dilation
        # This is a basic implementation; a real system would use more sophisticated morphological operations
        
        # Dilation
        mask_dilated = F.max_pool2d(
            mask.unsqueeze(0),
            kernel_size=kernel.shape[0],
            stride=1,
            padding=kernel.shape[0]//2
        ).squeeze(0)
        
        # Erosion
        mask_eroded = -F.max_pool2d(
            -mask_dilated.unsqueeze(0),
            kernel_size=kernel.shape[0],
            stride=1,
            padding=kernel.shape[0]//2
        ).squeeze(0)
        
        return mask_eroded
    
    def detect_contours(self, silhouette):
        """
        Detect contours in silhouette
        
        Args:
            silhouette: Binary silhouette mask
            
        Returns:
            Array of contour points
        """
        # Convert to numpy for contour detection
        silhouette_np = silhouette.cpu().numpy()
        
        # Use gradient to find edges
        gradient_x = np.gradient(silhouette_np, axis=1)
        gradient_y = np.gradient(silhouette_np, axis=0)
        
        # Find magnitude of gradient
        gradient_magnitude = np.sqrt(gradient_x**2 + gradient_y**2)
        
        # Threshold to get contour points
        contour_threshold = 0.1
        contour_points = np.where(gradient_magnitude > contour_threshold)
        
        # Combine points into list of [y, x] coordinates
        contour = np.array(list(zip(contour_points[0], contour_points[1])))
        
        return contour
    
    def generate_pattern_pieces(self, contour, num_pieces=4):
        """
        Generate pattern pieces from contour
        
        Args:
            contour: Array of contour points
            num_pieces: Number of pattern pieces to generate
            
        Returns:
            List of pattern pieces
        """
        # This is a simplified approach; a real implementation would use more sophisticated methods
        
        # Get centroid of contour
        centroid = np.mean(contour, axis=0)
        
        # Get distances from centroid to each point
        distances = np.sqrt(np.sum((contour - centroid)**2, axis=1))
        
        # Find longest distances in different directions to approximate extremities
        angle_bins = np.linspace(0, 2*np.pi, num_pieces+1)[:-1]
        angle_width = 2*np.pi / num_pieces
        
        extremity_points = []
        for angle in angle_bins:
            # Define angle range for this sector
            angle_min = angle
            angle_max = angle + angle_width
            
            # Calculate angles of all points relative to centroid
            point_angles = np.arctan2(contour[:, 0] - centroid[0], contour[:, 1] - centroid[1]) % (2*np.pi)
            
            # Find points in this angle range
            if angle_min < angle_max:
                sector_points = contour[(point_angles >= angle_min) & (point_angles < angle_max)]
                sector_distances = distances[(point_angles >= angle_min) & (point_angles < angle_max)]
            else:  # Handle wrap-around
                sector_points = contour[(point_angles >= angle_min) | (point_angles < angle_max)]
                sector_distances = distances[(point_angles >= angle_min) | (point_angles < angle_max)]
            
            if len(sector_points) > 0:
                # Find point with maximum distance in this sector
                max_dist_idx = np.argmax(sector_distances)
                extremity_points.append(sector_points[max_dist_idx])
        
        # Generate pattern pieces based on the extremity points
        pattern_pieces = []
        for i in range(num_pieces):
            # Create a simplified rectangular piece
            p1 = extremity_points[i]
            p2 = extremity_points[(i+1) % num_pieces]
            
            # Add more points to form a quadrilateral
            vec = p2 - p1
            perp_vec = np.array([-vec[1], vec[0]])
            perp_vec = perp_vec / (np.linalg.norm(perp_vec) + 1e-8) * 20  # Scale to reasonable size
            
            piece = np.array([
                p1,
                p1 + perp_vec,
                p2 + perp_vec,
                p2
            ])
            
            pattern_pieces.append(piece)
        
        return pattern_pieces
    
    def visualize_pattern(self, original_image, silhouette, contour, pattern_pieces, output_path):
        """
        Visualize extracted pattern
        
        Args:
            original_image: Original PIL image
            silhouette: Binary silhouette mask
            contour: Array of contour points
            pattern_pieces: List of pattern pieces
            output_path: Path to save the visualization
            
        Returns:
            Path to the saved visualization
        """
        # Convert tensors to numpy
        silhouette_np = silhouette.cpu().numpy()
        
        # Create figure with subplots
        fig, axes = plt.subplots(2, 2, figsize=(12, 10))
        
        # Original image
        axes[0, 0].imshow(original_image)
        axes[0, 0].set_title('Original Image')
        axes[0, 0].axis('off')
        
        # Silhouette
        axes[0, 1].imshow(silhouette_np, cmap='gray')
        axes[0, 1].set_title('Silhouette')
        axes[0, 1].axis('off')
        
        # Contour
        axes[1, 0].imshow(silhouette_np, cmap='gray', alpha=0.5)
        axes[1, 0].scatter(contour[:, 1], contour[:, 0], c='red', s=1)
        axes[1, 0].set_title('Contour')
        axes[1, 0].axis('off')
        
        # Pattern pieces
        axes[1, 1].imshow(np.ones_like(silhouette_np), cmap='gray', alpha=0.2)
        
        # Add pattern pieces with different colors
        colors = ['r', 'g', 'b', 'c', 'm', 'y']
        for i, piece in enumerate(pattern_pieces):
            color = colors[i % len(colors)]
            poly = patches.Polygon(piece[:, [1, 0]], closed=True, fill=True, alpha=0.5, color=color)
            axes[1, 1].add_patch(poly)
        
        axes[1, 1].set_title('Pattern Pieces')
        axes[1, 1].axis('off')
        
        # Adjust layout and save
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        return output_path

# Main pattern extraction function to be used by the API
def extract_pattern(design_image_path, output_path, num_pieces=4):
    """
    Extract clothing pattern from design image
    
    Args:
        design_image_path: Path to the design image
        output_path: Path to save the visualization
        num_pieces: Number of pattern pieces to generate
        
    Returns:
        Dictionary with pattern extraction results
    """
    # Initialize pattern extractor
    extractor = PatternExtractor()
    
    # Load and preprocess image
    image_tensor, original_image = extractor.load_image(design_image_path)
    
    # Extract silhouette
    silhouette = extractor.extract_silhouette(image_tensor)
    
    # Detect contours
    contour = extractor.detect_contours(silhouette)
    
    # Generate pattern pieces
    pattern_pieces = extractor.generate_pattern_pieces(contour, num_pieces)
    
    # Visualize pattern
    visualization_path = extractor.visualize_pattern(
        original_image, silhouette, contour, pattern_pieces, output_path
    )
    
    # Prepare pattern data for return
    pattern_data = {
        'num_pieces': num_pieces,
        'pieces': [piece.tolist() for piece in pattern_pieces]
    }
    
    return {
        'design_image': design_image_path,
        'visualization': visualization_path,
        'pattern_data': pattern_data
    }

# Export functions for API
__all__ = ['extract_pattern']
