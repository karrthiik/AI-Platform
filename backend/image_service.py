import os

def save_image(file, upload_dir="data"):
    os.makedirs(upload_dir, exist_ok=True)
    path = os.path.join(upload_dir, file.filename)

    with open(path, "wb") as f:
        f.write(file.file.read())

    return path