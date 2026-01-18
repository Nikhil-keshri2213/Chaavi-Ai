import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import load_model
from PIL import Image
import matplotlib.pyplot as plt
from utils.ela_fun import convert_to_ela_image

# Load the pre-trained model
model = load_model('models/mobilenet_forgery_model.h5')
IMG_SIZE = (128, 128)

def test_image(model, image_path):
    # 1. Convert to ELA
    ela_img = convert_to_ela_image(image_path, quality=90)
    
    if ela_img is not None:
        # 2. Resize
        ela_img = ela_img.resize(IMG_SIZE)
        
        # 3. Preprocess for MobileNetV2
        # (Convert to array -> expand dims -> preprocess_input)
        img_array = np.array(ela_img)
        img_array = np.expand_dims(img_array, axis=0) # Shape becomes (1, 128, 128, 3)
        img_array = preprocess_input(img_array)       # Scales to [-1, 1]
        
        # 4. Predict
        prediction = model.predict(img_array)
        class_idx = np.argmax(prediction)
        confidence = np.max(prediction) * 100
        
        label = "Tempered" if class_idx == 1 else "Authentic"
        
        print(f"Result: {label} ({confidence:.2f}%)")
        
        plt.imshow(ela_img)
        plt.axis('off')
        plt.title(f"Predicted: {label}")
        plt.show()
    else:
        print("Error: Could not process image.")

# Example Usage
test_image(model, 'C:\\Users\\Nikhil\\Pictures\\Camera Roll\\test.jpg')