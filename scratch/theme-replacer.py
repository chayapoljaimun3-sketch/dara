import os
import re

# Base directory for source code
base_dir = r"c:\Users\Admin\Desktop\dara\src"

# Files to update
target_files = [
    os.path.join(base_dir, "components", "TiptapEditor.tsx"),
    os.path.join(base_dir, "app", "HomeClient.tsx"),
    os.path.join(base_dir, "app", "auth", "register", "page.tsx"),
    os.path.join(base_dir, "app", "auth", "logout", "page.tsx"),
    os.path.join(base_dir, "app", "auth", "login", "page.tsx"),
    os.path.join(base_dir, "app", "admin", "users", "page.tsx"),
    os.path.join(base_dir, "app", "admin", "page", "page.tsx"),
    os.path.join(base_dir, "app", "admin", "post", "PostManagement.tsx"),
    os.path.join(base_dir, "app", "admin", "layout.tsx"),
    os.path.join(base_dir, "app", "admin", "category", "page.tsx"),
    os.path.join(base_dir, "app", "admin", "dashboard", "page.tsx"),
    os.path.join(base_dir, "app", "admin", "banner", "page.tsx"),
]

print("Starting theme replacer...")

for file_path in target_files:
    if not os.path.exists(file_path):
        print(f"Skipping: {file_path} (not found)")
        continue

    print(f"Processing: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Perform replacements:
    # 1. violet -> rose
    # 2. indigo -> red
    new_content = content.replace("violet", "rose").replace("indigo", "red")
    
    # Custom adjustments if any:
    # e.g., Let's make sure things like 'DARA ADMIN' or 'DARA PORTAL' headers have a beautiful school look
    if "DARA ADMIN" in new_content:
        new_content = new_content.replace("text-rose-400", "text-rose-500 font-extrabold")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Theme replacement completed successfully!")
