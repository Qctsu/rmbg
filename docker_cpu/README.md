# Docker CPU Background Remover

This directory contains a minimal example for running the BRIAAI RMBG model
inside Docker using only the CPU. The container bundles the ONNX model files
and a Python script that can handle multiple images in parallel.

## File structure

```
docker_cpu/
├── Dockerfile             # build instructions for the container
├── docker-compose.yml     # compose configuration
├── process_images.py      # CLI helpers for background removal
├── server.py              # HTTP API server
├── README.md              # this file
├── input/                 # place input images here (optional)
└── output/                # processed images are written here (optional)
```

When deployed on the server copy the entire folder to
`/home/kucu/background-remover`.

## How it works

`process_images.py` contains the background removal logic using the BRIAAI
ONNX model and `onnxruntime`. `server.py` exposes this functionality via a
simple HTTP API built with Flask.

The Dockerfile concatenates the split model files from `packages/model-briaai`
into `briaai.onnx` and installs minimal runtime dependencies including Flask.

## Usage

1. Copy this directory to `/home/kucu/background-remover` on the host and
   create optional `input/` and `output/` folders if you want to batch process
   files via CLI:
   ```bash
   mkdir -p /home/kucu/background-remover/input \
       /home/kucu/background-remover/output
   ```
2. From `/home/kucu/background-remover` build and start the container:
   ```bash
   docker compose up --build
   ```
3. Send an image to the API and write the result to a file:
   ```bash
   curl -X POST http://172.20.0.18:8000/remove-bg -F "file=@stamp.jpeg" \
        --output result.png
   ```

### Manual run

```bash
docker build -t rmbg-cpu /home/kucu/background-remover

docker run --rm \
  -v /home/kucu/background-remover/input:/data/input \
  -v /home/kucu/background-remover/output:/data/output \
  rmbg-cpu python process_images.py /data/input/* -o /data/output
```
