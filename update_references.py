import os
import re

def update_image_references(root_dir):
    # Extensions to replace
    img_extensions = r'\.(jpg|jpeg|png|JPG|JPEG|PNG)'
    # File types to search for references in
    ref_extensions = ('.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.vue')
    
    exclude_dirs = {'.git', 'node_modules', 'dist'}
    
    updated_files_count = 0
    total_replacements = 0

    print(f"Scanning for references in: {root_dir}")

    for root, dirs, files in os.walk(root_dir):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(ref_extensions) and file != 'update_references.py' and file != 'convert_to_webp.py':
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Regex to find image extensions
                new_content, count = re.subn(img_extensions, '.webp', content)
                
                if count > 0:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {count} references in: {file}")
                    updated_files_count += 1
                    total_replacements += count

    print("\n" + "="*30)
    print("Reference Update Summary")
    print("="*30)
    print(f"Files updated:        {updated_files_count}")
    print(f"Total replacements:   {total_replacements}")
    print("="*30)

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    update_image_references(current_directory)
