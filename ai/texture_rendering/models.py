import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
import torchvision.transforms as transforms

class TextureRenderer:
    def __init__(self):
        """
        Initialize texture renderer
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Transform to prepare texture image for model
        self.transform = transforms.Compose([
            transforms.ToTensor(),
        ])
    
    def apply_texture(self, object_mask, texture_image, texture_type='simple', texture_params=None):
        """
        Apply texture to object mask
        
        Args:
            object_mask: Binary mask of the object
            texture_image: Path to texture image
            texture_type: Type of texture application (simple, mapped, procedural)
            texture_params: Additional parameters for texture application
            
        Returns:
            Object with applied texture
        """
        # Load texture image
        texture = Image.open(texture_image).convert('RGB')
        texture_tensor = self.transform(texture).to(self.device)
        
        # Convert mask to tensor
        if isinstance(object_mask, str):
            # If object_mask is a path to an image
            mask_img = Image.open(object_mask).convert('L')
            mask = np.array(mask_img) / 255.0
        else:
            # If object_mask is already a numpy array
            mask = object_mask / 255.0 if object_mask.max() > 1.0 else object_mask
        
        mask_tensor = torch.tensor(mask, dtype=torch.float32).to(self.device)
        
        # Expand mask to match texture dimensions (3 channels)
        if len(mask_tensor.shape) == 2:
            mask_tensor = mask_tensor.unsqueeze(0)
        if mask_tensor.shape[0] == 1:
            mask_tensor = mask_tensor.repeat(3, 1, 1)
        
        # Resize texture to match mask dimensions
        texture_resized = F.interpolate(
            texture_tensor.unsqueeze(0),
            size=(mask_tensor.shape[1], mask_tensor.shape[2]),
            mode='bilinear',
            align_corners=False
        ).squeeze(0)
        
        # Apply texture based on type
        if texture_type == 'simple':
            # Simple overlay
            textured_object = texture_resized * mask_tensor
        
        elif texture_type == 'mapped':
            # UV mapping (more complex mapping)
            if texture_params is None:
                texture_params = {'scale': 1.0, 'rotation': 0.0, 'offset_x': 0.0, 'offset_y': 0.0}
            
            scale = texture_params.get('scale', 1.0)
            rotation = texture_params.get('rotation', 0.0)
            offset_x = texture_params.get('offset_x', 0.0)
            offset_y = texture_params.get('offset_y', 0.0)
            
            # Create UV coordinates
            h, w = mask_tensor.shape[1:]
            y_coords, x_coords = torch.meshgrid(
                torch.arange(h, device=self.device),
                torch.arange(w, device=self.device)
            )
            
            # Normalize coordinates to [-1, 1]
            y_coords = (y_coords / (h - 1)) * 2 - 1
            x_coords = (x_coords / (w - 1)) * 2 - 1
            
            # Apply transformations
            # Scale
            x_coords = x_coords * scale
            y_coords = y_coords * scale
            
            # Rotation
            angle = rotation * np.pi / 180
            x_rot = x_coords * np.cos(angle) - y_coords * np.sin(angle)
            y_rot = x_coords * np.sin(angle) + y_coords * np.cos(angle)
            x_coords, y_coords = x_rot, y_rot
            
            # Offset
            x_coords = x_coords + offset_x
            y_coords = y_coords + offset_y
            
            # Convert back to [0, 1] for grid_sample
            x_coords = (x_coords + 1) / 2
            y_coords = (y_coords + 1) / 2
            
            # Stack coordinates for grid_sample
            grid = torch.stack([x_coords, y_coords], dim=2).unsqueeze(0)
            
            # Sample texture using grid
            sampled_texture = F.grid_sample(
                texture_tensor.unsqueeze(0),
                grid,
                mode='bilinear',
                padding_mode='reflection',
                align_corners=False
            ).squeeze(0)
            
            # Apply mask
            textured_object = sampled_texture * mask_tensor
        
        elif texture_type == 'procedural':
            # Procedurally generated texture
            if texture_params is None:
                texture_params = {'pattern': 'noise', 'scale': 0.1, 'color1': [1, 0, 0], 'color2': [0, 0, 1]}
            
            pattern = texture_params.get('pattern', 'noise')
            scale = texture_params.get('scale', 0.1)
            color1 = torch.tensor(texture_params.get('color1', [1, 0, 0]), device=self.device)
            color2 = torch.tensor(texture_params.get('color2', [0, 0, 1]), device=self.device)
            
            h, w = mask_tensor.shape[1:]
            
            if pattern == 'noise':
                # Perlin-like noise
                noise = torch.randn((1, 1, h//8, w//8), device=self.device)
                noise = F.interpolate(noise, size=(h, w), mode='bilinear', align_corners=False)
                noise = (noise - noise.min()) / (noise.max() - noise.min())
                
                # Map noise to colors
                color_factor = noise.repeat(1, 3, 1, 1).squeeze(0)
                procedural_texture = color1.view(3, 1, 1) * color_factor + color2.view(3, 1, 1) * (1 - color_factor)
                
            elif pattern == 'checker':
                # Checker pattern
                y_coords, x_coords = torch.meshgrid(
                    torch.arange(h, device=self.device),
                    torch.arange(w, device=self.device)
                )
                
                checker = ((y_coords.float() * scale).floor() + (x_coords.float() * scale).floor()) % 2
                checker = checker.unsqueeze(0)
                
                # Map checker to colors
                color_factor = checker.repeat(3, 1, 1)
                procedural_texture = color1.view(3, 1, 1) * color_factor + color2.view(3, 1, 1) * (1 - color_factor)
                
            elif pattern == 'stripes':
                # Stripe pattern
                x_coords = torch.arange(w, device=self.device).unsqueeze(0).repeat(h, 1)
                stripes = ((x_coords.float() * scale).floor()) % 2
                stripes = stripes.unsqueeze(0)
                
                # Map stripes to colors
                color_factor = stripes.repeat(3, 1, 1)
                procedural_texture = color1.view(3, 1, 1) * color_factor + color2.view(3, 1, 1) * (1 - color_factor)
                
            else:
                # Default to texture image
                procedural_texture = texture_resized
            
            # Apply mask
            textured_object = procedural_texture * mask_tensor
            
        else:
            # Default to simple overlay
            textured_object = texture_resized * mask_tensor
        
        # Convert to numpy and return
        textured_object_np = textured_object.permute(1, 2, 0).cpu().numpy()
        textured_object_np = (textured_object_np * 255).astype(np.uint8)
        
        return textured_object_np
    
    def save_textured_object(self, textured_object, output_path):
        """
        Save textured object as image
        
        Args:
            textured_object: Textured object array
            output_path: Path to save the output image
            
        Returns:
            Path to the output image
        """
        # Convert to PIL image and save
        output_image = Image.fromarray(textured_object)
        output_image.save(output_path)
        
        return output_path

# Main texture rendering function to be used by the API
def render_texture(object_mask_path, texture_image_path, output_path, texture_type='simple', texture_params=None):
    """
    Render texture on an object mask
    
    Args:
        object_mask_path: Path to the object mask image
        texture_image_path: Path to the texture image
        output_path: Path to save the output image
        texture_type: Type of texture application
        texture_params: Additional parameters for texture application
        
    Returns:
        Dictionary with input and output paths
    """
    renderer = TextureRenderer()
    textured_object = renderer.apply_texture(
        object_mask_path,
        texture_image_path,
        texture_type,
        texture_params
    )
    result_path = renderer.save_textured_object(textured_object, output_path)
    
    return {
        'object_mask': object_mask_path,
        'texture_image': texture_image_path,
        'output_image': result_path,
        'texture_type': texture_type
    }

# Export functions for API
__all__ = ['render_texture']
