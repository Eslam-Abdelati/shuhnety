import os

def check_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        if content.endswith('</div>'):
                            print(f"Potential issue in: {path}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")

check_files('src')
