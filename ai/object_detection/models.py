import torch
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.models.segmentation import deeplabv3_resnet101

class ObjectDetection:
    def __init__(self):
        # Load pre-trained model for object detection
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        # COCO dataset class names
        self.CLASSES = [
            '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
            'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'N/A', 'stop sign',
            'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
            'elephant', 'bear', 'zebra', 'giraffe', 'N/A', 'backpack', 'umbrella', 'N/A', 'N/A',
            'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
            'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
            'bottle', 'N/A', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
            'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
            'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'N/A', 'dining table',
            'N/A', 'N/A', 'toilet', 'N/A', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
            'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'N/A', 'book',
            'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
        ]
        
        # Fashion related classes
        self.FASHION_CLASSES = [
            'person', 'tie', 'backpack', 'handbag', 'suitcase', 
            'sports ball', 'skateboard', 'surfboard', 'tennis racket',
            'bottle', 'cup', 'fork', 'knife', 'spoon', 'bowl',
            'chair', 'couch', 'potted plant', 'bed', 'dining table',
            'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
            'book', 'clock', 'vase', 'scissors'
        ]
        
        # Transform to prepare image for model
        self.transform = transforms.Compose([
            transforms.ToTensor(),
        ])
    
    def detect_objects(self, image_path):
        """
        Detect objects in an image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of dictionaries with detected objects (class, confidence, bounding box)
        """
        # Load image
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Run inference
        with torch.no_grad():
            predictions = self.model(image_tensor)
        
        # Process predictions
        pred_classes = predictions[0]['labels'].cpu().numpy()
        pred_scores = predictions[0]['scores'].cpu().numpy()
        pred_bboxes = predictions[0]['boxes'].cpu().numpy()
        
        # Filter predictions (confidence > 0.5)
        keep_indices = np.where(pred_scores > 0.5)[0]
        
        results = []
        for idx in keep_indices:
            class_id = pred_classes[idx]
            class_name = self.CLASSES[class_id]
            
            # Skip if not in fashion related classes
            if class_name not in self.FASHION_CLASSES:
                continue
                
            result = {
                'class': class_name,
                'confidence': float(pred_scores[idx]),
                'bbox': pred_bboxes[idx].tolist()
            }
            results.append(result)
        
        return results

class Segmentation:
    def __init__(self):
        # Load pre-trained model for segmentation
        self.model = deeplabv3_resnet101(pretrained=True)
        self.model.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        # Transform to prepare image for model
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    
    def segment_image(self, image_path):
        """
        Segment objects in an image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Segmentation mask
        """
        # Load image
        image = Image.open(image_path).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Run inference
        with torch.no_grad():
            output = self.model(image_tensor)['out'][0]
        
        # Get segmentation mask
        output_predictions = output.argmax(0).cpu().numpy()
        
        return output_predictions
    
    def apply_segmentation_mask(self, image_path, mask, output_path):
        """
        Apply segmentation mask to image
        
        Args:
            image_path: Path to the input image
            mask: Segmentation mask
            output_path: Path to save the output image
            
        Returns:
            Path to the output image
        """
        # Load image
        image = Image.open(image_path).convert('RGB')
        
        # Convert image to numpy array
        image_np = np.array(image)
        
        # Create a binary mask (1 for foreground, 0 for background)
        binary_mask = (mask > 0).astype(np.uint8)
        
        # Expand mask to match image dimensions
        expanded_mask = np.expand_dims(binary_mask, axis=2)
        expanded_mask = np.repeat(expanded_mask, 3, axis=2)
        
        # Apply mask to image
        masked_image = image_np * expanded_mask
        
        # Convert back to PIL image and save
        output_image = Image.fromarray(masked_image)
        output_image.save(output_path)
        
        return output_path

# Main object detection class to be used by the API
def detect_fashion_objects(image_path):
    """
    Detect fashion objects in an image
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary with detected objects
    """
    obj_detector = ObjectDetection()
    detected_objects = obj_detector.detect_objects(image_path)
    
    return {
        'image_path': image_path,
        'objects': detected_objects
    }

# Segment fashion objects from image
def segment_fashion_object(image_path, output_path):
    """
    Segment fashion objects from image
    
    Args:
        image_path: Path to the input image
        output_path: Path to save the output image
        
    Returns:
        Path to the output image
    """
    segmentation_model = Segmentation()
    mask = segmentation_model.segment_image(image_path)
    result_path = segmentation_model.apply_segmentation_mask(image_path, mask, output_path)
    
    return {
        'input_image': image_path,
        'output_image': result_path
    }

# Export functions for API
__all__ = ['detect_fashion_objects', 'segment_fashion_object']
