import os
import re

def optimize_html(root_dir):
    html_files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    for filename in html_files:
        file_path = os.path.join(root_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()


        def logo_hero_replacer(match):
            img_tag = match.group(0)
            if 'fetchpriority' not in img_tag:
                return img_tag.replace('<img', '<img fetchpriority="high"')
            return img_tag

        content = re.sub(r'<img[^>]+(?:logo|hero)[^>]+>', logo_hero_replacer, content, flags=re.IGNORECASE)

        def lazy_async_replacer(match):
            img_tag = match.group(0)

            if 'fetchpriority="high"' in img_tag:
                return img_tag
            
            new_tag = img_tag
            if 'loading=' not in new_tag:
                new_tag = new_tag.replace('<img', '<img loading="lazy"')
            if 'decoding=' not in new_tag:
                new_tag = new_tag.replace('<img', '<img decoding="async"')
            return new_tag

        content = re.sub(r'<img[^>]+>', lazy_async_replacer, content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Optimized images in: {filename}")

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    optimize_html(current_directory)
