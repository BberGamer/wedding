import os
import re

src_dir = os.path.abspath("FE/src")
config_file = os.path.join(src_dir, "config.js")

def refactor_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "http://localhost:5000" not in content:
        return False
    
    # Calculate relative path to config.js
    rel_path = os.path.relpath(config_file, os.path.dirname(file_path)).replace("\\", "/")
    # If the relative path starts with 'config.js', prepend './'
    if not rel_path.startswith("."):
        rel_path = "./" + rel_path
    # Strip the '.js' extension for standard react imports
    if rel_path.endswith(".js"):
        rel_path = rel_path[:-3]
        
    import_stmt = f'import {{ API_URL }} from "{rel_path}";\n'
    
    # Replace hardcoded URLs:
    # 1. String literals with double quotes: "http://localhost:5000/api/xyz" -> `${API_URL}/api/xyz`
    content = re.sub(r'"http://localhost:5000([^"]*)"', r'`${API_URL}\1`', content)
    # 2. String literals with single quotes: 'http://localhost:5000/api/xyz' -> `${API_URL}/api/xyz`
    content = re.sub(r"'http://localhost:5000([^']*)'", r'`${API_URL}\1`', content)
    # 3. Template literals: `http://localhost:5000/api/xyz` -> `${API_URL}/api/xyz`
    content = content.replace("http://localhost:5000", "${API_URL}")
    
    # Insert the import statement
    # Let's find the best place to insert: after the last import or at the very beginning
    lines = content.splitlines()
    insert_idx = 0
    for idx, line in enumerate(lines):
        if line.strip().startswith("import "):
            insert_idx = idx + 1
            
    lines.insert(insert_idx, import_stmt.strip())
    new_content = "\n".join(lines) + "\n"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Refactored: {file_path}")
    return True

# Recursively scan FE/src for .jsx files
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx"):
            refactor_file(os.path.join(root, file))
