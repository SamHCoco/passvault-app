from PIL import Image

def resize_image(input_image_path, output_image_path, width, height):
    try:
        with Image.open(input_image_path) as img:
            resized_img = img.resize((width, height), Image.LANCZOS)
            resized_img.save(output_image_path)
            print("Image successfully resized.")
    except IOError:
        print("Unable to load the image.")

if __name__ == "__main__":
    input_image_path = "./passvault-icon-final.png"
    output_image_path = "./passvault-icon-final-square-playstore.png"
    target_width = 512  # Specify your desired width here
    target_height = 512  # Specify your desired height here

    resize_image(input_image_path, output_image_path, target_width, target_height)
