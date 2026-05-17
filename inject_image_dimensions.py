import os
import re
import urllib.parse
from PIL import Image

def inject_dimensions_in_file(file_path, public_dir):
    print(f"Processing: {os.path.basename(file_path)}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    img_re = re.compile(r'(<img\b[^>]*>)', re.IGNORECASE)
    src_re = re.compile(r'src=["\']([^"\']*)["\']', re.IGNORECASE)
    width_re = re.compile(r'\bwidth=["\']\d+["\']', re.IGNORECASE)
    height_re = re.compile(r'\bheight=["\']\d+["\']', re.IGNORECASE)
    
    modified = False
    new_content = content
    
    # Find all <img ...> tags
    img_tags = img_re.findall(content)
    
    for tag in img_tags:
        # Check if the tag already has width and height attributes to prevent double-processing
        if width_re.search(tag) and height_re.search(tag):
            continue
            
        # Extract src attribute
        src_match = src_re.search(tag)
        if not src_match:
            continue
            
        src_url = src_match.group(1)
        
        # We only process local images (skip remote or base64)
        if src_url.startswith(('http://', 'https://', 'data:')):
            continue
            
        # Unquote URL encoding (e.g. converting %20 to spaces)
        src_path = urllib.parse.unquote(src_url)
        
        # Only process raster images (skip SVG since PIL cannot open SVG)
        if src_path.lower().endswith('.svg'):
            continue
            
        # Build physical path in workspace (Vite absolute paths map directly to public directory)
        clean_src = src_path.lstrip('/')
        physical_path = os.path.join(public_dir, clean_src)
        
        # If not found directly, try relative to root
        if not os.path.exists(physical_path):
            physical_path = os.path.join(os.path.dirname(file_path), clean_src)
            
        if os.path.exists(physical_path):
            try:
                with Image.open(physical_path) as img:
                    width, height = img.size
                
                # Construct new tag with attributes
                # If width or height exists partially, we remove them first
                new_tag = tag
                if width_re.search(new_tag):
                    new_tag = width_re.sub('', new_tag)
                if height_re.search(new_tag):
                    new_tag = height_re.sub('', new_tag)
                
                # Clean up multiple spaces created by previous deletions
                new_tag = re.sub(r'\s+', ' ', new_tag)
                
                # Insert the new width and height before the closing '>' or '/>'
                if new_tag.endswith('/>'):
                    replacement = f' width="{width}" height="{height}" />'
                    new_tag = new_tag[:-2].rstrip() + replacement
                else:
                    replacement = f' width="{width}" height="{height}">'
                    new_tag = new_tag[:-1].rstrip() + replacement
                
                # Replace the old tag with the updated tag in our content
                new_content = new_content.replace(tag, new_tag)
                print(f"  Injected size {width}x{height} for: {src_path}")
                modified = True
                
            except Exception as e:
                print(f"  Error opening {src_path}: {e}")
        else:
            print(f"  Warning: Asset not found locally: {src_path} (resolved as: {physical_path})")
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  SUCCESS: Updated {os.path.basename(file_path)}\n")
    else:
        print(f"  No modifications required for {os.path.basename(file_path)}\n")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(root_dir, 'public')
    
    html_files = [f for f in os.listdir(root_dir) if f.lower().endswith('.html')]
    
    if not html_files:
        print("No HTML files found in root directory!")
        return
        
    print(f"Found {len(html_files)} HTML files to audit...")
    print(f"Public assets directory: {public_dir}\n")
    
    for file in html_files:
        file_path = os.path.join(root_dir, file)
        inject_dimensions_in_file(file_path, public_dir)

if __name__ == "__main__":
    main()
