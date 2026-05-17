import os
import re
import urllib.request
import urllib.parse

def download_fonts():
    URL = "https://fonts.googleapis.com/css2?family=Urbanist:wght@100..900&display=swap"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    fonts_dir = os.path.join(root_dir, 'public', 'fonts')
    os.makedirs(fonts_dir, exist_ok=True)
    
    print("Fetching font stylesheet from Google Fonts API...")
    req = urllib.request.Request(URL, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            css_content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching fonts stylesheet: {e}")
        return
        
    url_pattern = re.compile(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)')
    urls = url_pattern.findall(css_content)
    
    if not urls:
        print("No .woff2 font links found inside the stylesheet!")
        return
        
    print(f"Found {len(urls)} woff2 font files. Downloading locally...")
    
    downloaded_mapping = {}
    for idx, url in enumerate(urls, 1):
        filename = url.split('/')[-1]
        dest_path = os.path.join(fonts_dir, filename)
        
        if not os.path.exists(dest_path):
            print(f"[{idx}/{len(urls)}] Downloading: {filename}")
            try:
                file_req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(file_req) as file_resp:
                    with open(dest_path, 'wb') as f:
                        f.write(file_resp.read())
            except Exception as e:
                print(f"  Error downloading {filename}: {e}")
                continue
        else:
            print(f"[{idx}/{len(urls)}] Already exists: {filename}")
            
        downloaded_mapping[url] = f'/fonts/{filename}'
        
    local_css = css_content
    for remote_url, local_path in downloaded_mapping.items():
        local_css = local_css.replace(remote_url, local_path)
        
    style_css_path = os.path.join(root_dir, 'style.css')
    if not os.path.exists(style_css_path):
        print(f"Error: style.css not found at {style_css_path}")
        return
        
    with open(style_css_path, 'r', encoding='utf-8') as f:
        style_content = f.read()
        
    start_marker = "/* LOCAL FONT HOSTING (URBANIST) START */"
    end_marker = "/* LOCAL FONT HOSTING (URBANIST) END */"
    
    font_css_block = f"{start_marker}\n{local_css}\n{end_marker}\n"
    
    if start_marker in style_content and end_marker in style_content:
        pattern = re.compile(rf"{re.escape(start_marker)}.*?{re.escape(end_marker)}", re.DOTALL)
        updated_style = pattern.sub(font_css_block.strip(), style_content)
        print("\nSuccessfully updated existing font blocks inside style.css!")
    else:
        updated_style = font_css_block + style_content
        print("\nSuccessfully prepended new font blocks to style.css!")
        
    with open(style_css_path, 'w', encoding='utf-8') as f:
        f.write(updated_style)

if __name__ == "__main__":
    download_fonts()
