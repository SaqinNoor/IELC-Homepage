import os
import urllib.request

def download_file(url, save_path):
    print(f"Downloading {url} ...")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(save_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  SUCCESS: Saved to {os.path.basename(save_path)}")
    except Exception as e:
        print(f"  FAILED to download {url}: {e}")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    fonts_dir = os.path.join(root_dir, 'public', 'fonts')
    
    if not os.path.exists(fonts_dir):
        os.makedirs(fonts_dir)
        print(f"Created directory: {fonts_dir}")
        
    font_urls = {
        "100": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDyx8vEZmq.woff2",
        "200": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDSx4vEZmq.woff2",
        "300": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDlR4vEZmq.woff2",
        "400": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDyx4vEZmq.woff2",
        "500": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqD-R4vEZmq.woff2",
        "600": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDFRkvEZmq.woff2",
        "700": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDLBkvEZmq.woff2",
        "800": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDSxkvEZmq.woff2",
        "900": "https://fonts.gstatic.com/s/urbanist/v18/L0xjDF02iFML4hGCyOCpRdycFsGxSrqDYhkvEZmq.woff2"
    }
    
    print("Starting download of Urbanist WOFF2 font files...\n")
    
    for weight, url in font_urls.items():
        save_path = os.path.join(fonts_dir, f"urbanist-v18-{weight}.woff2")
        download_file(url, save_path)
        
    print("\nAll font downloads processed!")

if __name__ == "__main__":
    main()
