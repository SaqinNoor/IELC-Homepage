import os
import sys
from PIL import Image

def resize_and_compress(root_dir, max_width=350, quality=75):
    target_dirs = ['5th EC', '6th EC', '7th EC', '8th EC', '9th EC', 'NELC', 'Eloquence']
    extensions = ('.webp', '.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
    
    total_original_size = 0
    total_new_size = 0
    processed_count = 0
    skipped_count = 0
    error_count = 0
    
    print(f"Scanning target folders in: {root_dir}")
    print(f"Resizing profile images to max width: {max_width}px, event images to 500px, Quality: {quality}\n")
    
    public_path = os.path.join(root_dir, 'public')
    if not os.path.exists(public_path):
        print(f"Error: public directory not found at {public_path}")
        sys.exit(1)
        
    for target in target_dirs:
        target_path = os.path.join(public_path, target)
        if not os.path.exists(target_path):
            print(f"Skipping {target} (directory does not exist)")
            continue
            
        print(f"Processing directory: {target}...")
        
        # Determine maximum width based on directory type
        current_max_width = 500 if target in ['NELC', 'Eloquence'] else max_width
        
        for root, _, files in os.walk(target_path):
            for file in files:
                if file.lower().endswith(extensions):
                    file_path = os.path.join(root, file)
                    original_size = os.path.getsize(file_path)
                    
                    try:
                        with Image.open(file_path) as img:
                            width, height = img.size
                            
                            if width > current_max_width:
                                ratio = current_max_width / float(width)
                                new_height = int(float(height) * float(ratio))
                                try:
                                    resample_method = Image.Resampling.LANCZOS
                                except AttributeError:
                                    resample_method = Image.ANTIALIAS
                                
                                img_resized = img.resize((current_max_width, new_height), resample_method)
                                print(f"  Resizing: {file} ({width}x{height} -> {current_max_width}x{new_height})")
                            else:
                                img_resized = img.copy()
                                print(f"  Compressing: {file} ({width}x{height})")
                            
                            temp_path = file_path + ".tmp"
                            img_resized.save(temp_path, "WEBP", quality=quality, method=6)
                            
                            img_resized.close()
                            
                        os.replace(temp_path, file_path)
                        
                        new_size = os.path.getsize(file_path)
                        saving = original_size - new_size
                        saving_percent = (saving / original_size) * 100 if original_size > 0 else 0
                        
                        total_original_size += original_size
                        total_new_size += new_size
                        processed_count += 1
                        
                        print(f"    Size: {original_size / 1024:.1f} KB -> {new_size / 1024:.1f} KB (Saved {saving_percent:.1f}%)")
                        
                    except Exception as e:
                        print(f"  Error optimizing {file}: {e}")
                        error_count += 1
                        if os.path.exists(file_path + ".tmp"):
                            os.remove(file_path + ".tmp")
                            
    print("\n" + "="*45)
    print("Optimization Summary")
    print("="*45)
    print(f"Files successfully optimized: {processed_count}")
    print(f"Errors encountered:           {error_count}")
    if processed_count > 0:
        saved_bytes = total_original_size - total_new_size
        print(f"Original Total Size:          {total_original_size / 1024 / 1024:.2f} MB")
        print(f"Optimized Total Size:         {total_new_size / 1024 / 1024:.2f} MB")
        print(f"Total Bandwidth Saved:        {saved_bytes / 1024 / 1024:.2f} MB ({saved_bytes / total_original_size * 100:.1f}% reduction)")
    print("="*45)

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    resize_and_compress(current_directory)
