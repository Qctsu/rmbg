# Docker CPU Background Remover

This example runs the BRIAAI model on CPU inside Docker. It uses `onnxruntime` and supports processing multiple files in parallel.

## Usage

1. Place input images in the `input` directory.
2. Build and run the container with Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Processed images with transparent backgrounds will be saved to the `output` directory.

You can also run the container manually:
```bash
docker build -t rmbg-cpu docker_cpu
mkdir -p input output
# copy images into input/
docker run --rm -v $(pwd)/input:/data/input -v $(pwd)/output:/data/output rmbg-cpu python process_images.py /data/input/* -o /data/output
```
