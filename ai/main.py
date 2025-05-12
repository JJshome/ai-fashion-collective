from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import shutil
import time
from typing import Optional, Dict, Any, List
import json

# Import AI modules
from object_detection.models import detect_fashion_objects, segment_fashion_object
from texture_rendering.models import render_texture
from model_application.models import apply_design_to_model, create_model_animation
from pattern_extraction.models import extract_pattern

# Create FastAPI app
app = FastAPI(
    title="AI Fashion Collective API",
    description="API for AI-powered fashion design tools",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for uploads and results
os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)

# Helper functions
def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save an uploaded file to the uploads directory
    
    Args:
        upload_file: File uploaded by user
        
    Returns:
        Path to the saved file
    """
    file_path = f"uploads/{time.time()}_{upload_file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Welcome to AI Fashion Collective API"}

@app.post("/object-detection")
async def object_detection(
    file: UploadFile = File(...),
):
    """
    Detect fashion objects in an image
    
    Args:
        file: Image file to analyze
        
    Returns:
        JSON with detected objects
    """
    # Save uploaded file
    file_path = save_upload_file(file)
    
    # Detect objects
    result = detect_fashion_objects(file_path)
    
    return result

@app.post("/segment-object")
async def segment_object(
    file: UploadFile = File(...),
):
    """
    Segment fashion object from image
    
    Args:
        file: Image file to segment
        
    Returns:
        JSON with paths to input and output images
    """
    # Save uploaded file
    file_path = save_upload_file(file)
    
    # Create output path
    output_filename = f"segmented_{time.time()}_{file.filename}"
    output_path = f"results/{output_filename}"
    
    # Segment object
    result = segment_fashion_object(file_path, output_path)
    
    # Return file response
    return FileResponse(
        path=result["output_image"],
        media_type="image/png",
        filename=output_filename
    )

@app.post("/render-texture")
async def texture_rendering(
    object_file: UploadFile = File(...),
    texture_file: UploadFile = File(...),
    texture_type: str = Form("simple"),
    texture_params: Optional[str] = Form(None),
):
    """
    Render texture on an object
    
    Args:
        object_file: Image file with object mask
        texture_file: Image file with texture
        texture_type: Type of texture application
        texture_params: Additional parameters for texture application
        
    Returns:
        JSON with paths to input and output images
    """
    # Save uploaded files
    object_path = save_upload_file(object_file)
    texture_path = save_upload_file(texture_file)
    
    # Parse texture parameters
    params = None
    if texture_params:
        try:
            params = json.loads(texture_params)
        except:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid texture parameters"}
            )
    
    # Create output path
    output_filename = f"textured_{time.time()}_{object_file.filename}"
    output_path = f"results/{output_filename}"
    
    # Render texture
    result = render_texture(object_path, texture_path, output_path, texture_type, params)
    
    # Return file response
    return FileResponse(
        path=result["output_image"],
        media_type="image/png",
        filename=output_filename
    )

@app.post("/apply-to-model")
async def model_application(
    design_file: UploadFile = File(...),
    model_type: str = Form("smpl"),
    pose_params: Optional[str] = Form(None),
    shape_params: Optional[str] = Form(None),
):
    """
    Apply design to 3D model
    
    Args:
        design_file: Image file with design
        model_type: Type of 3D model
        pose_params: Parameters for posing the model
        shape_params: Parameters for model shape
        
    Returns:
        JSON with paths to rendered views
    """
    # Save uploaded file
    design_path = save_upload_file(design_file)
    
    # Parse parameters
    pose = None
    if pose_params:
        try:
            pose = json.loads(pose_params)
        except:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid pose parameters"}
            )
    
    shape = None
    if shape_params:
        try:
            shape = json.loads(shape_params)
        except:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid shape parameters"}
            )
    
    # Create output directory
    output_dir = f"results/model_{time.time()}"
    os.makedirs(output_dir, exist_ok=True)
    
    # Apply to model
    result = apply_design_to_model(design_path, output_dir, model_type, pose, shape)
    
    return result

@app.post("/extract-pattern")
async def pattern_extraction(
    design_file: UploadFile = File(...),
    num_pieces: int = Form(4),
):
    """
    Extract clothing pattern from design
    
    Args:
        design_file: Image file with design
        num_pieces: Number of pattern pieces to generate
        
    Returns:
        JSON with pattern extraction results
    """
    # Save uploaded file
    design_path = save_upload_file(design_file)
    
    # Create output path
    output_filename = f"pattern_{time.time()}_{design_file.filename}.png"
    output_path = f"results/{output_filename}"
    
    # Extract pattern
    result = extract_pattern(design_path, output_path, num_pieces)
    
    # Return visualization
    return FileResponse(
        path=result["visualization"],
        media_type="image/png",
        filename=output_filename
    )

@app.post("/generate")
async def ai_design_generation(
    prompt: str = Form(...),
    base_design_file: Optional[UploadFile] = File(None),
    parameters: Optional[str] = Form(None),
):
    """
    Generate clothing design using AI
    
    Args:
        prompt: Text prompt for design generation
        base_design_file: Optional base design to start from
        parameters: Additional generation parameters
        
    Returns:
        JSON with generated design
    """
    # Save base design if provided
    base_design_path = None
    if base_design_file:
        base_design_path = save_upload_file(base_design_file)
    
    # Parse parameters
    params = {}
    if parameters:
        try:
            params = json.loads(parameters)
        except:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid generation parameters"}
            )
    
    # Simulate AI design generation
    # In a real implementation, this would call a generative model
    
    # Create a dummy response
    output_filename = f"generated_{time.time()}.png"
    output_path = f"results/{output_filename}"
    
    # Just copy the base design as a placeholder
    if base_design_path:
        shutil.copy(base_design_path, output_path)
    else:
        # Create a dummy blank image
        from PIL import Image, ImageDraw
        img = Image.new('RGB', (512, 512), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        d.text((10, 10), f"AI Generated Design\nPrompt: {prompt}", fill=(0, 0, 0))
        img.save(output_path)
    
    return {
        "prompt": prompt,
        "parameters": params,
        "base_design": base_design_path,
        "imageUrl": output_path,
        "designData": {
            "type": "fashion",
            "style": "ai-generated",
            "prompt": prompt
        }
    }

@app.post("/process-evaluations")
async def process_evaluations(
    design_file: UploadFile = File(...),
    evaluations: str = Form(...),
):
    """
    Process evaluations and generate improved design
    
    Args:
        design_file: Image file with original design
        evaluations: JSON string with evaluation data
        
    Returns:
        JSON with improved design
    """
    # Save uploaded file
    design_path = save_upload_file(design_file)
    
    # Parse evaluations
    try:
        eval_data = json.loads(evaluations)
    except:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid evaluations data"}
        )
    
    # Simulate processing evaluations
    # In a real implementation, this would use the evaluations to guide a generative model
    
    # Create a dummy response
    output_filename = f"improved_{time.time()}.png"
    output_path = f"results/{output_filename}"
    
    # Just copy the original design as a placeholder
    shutil.copy(design_path, output_path)
    
    return {
        "original_design": design_path,
        "evaluations_count": len(eval_data),
        "imageUrl": output_path,
        "designData": {
            "type": "fashion",
            "style": "community-improved",
            "based_on_evaluations": len(eval_data)
        }
    }

# Run the API server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
