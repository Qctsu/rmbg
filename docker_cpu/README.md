# Docker CPU Background Remover

This directory contains a minimal example for running the BRIAAI RMBG model
inside Docker using only the CPU. The container bundles the ONNX model files
and a Python script that can handle multiple images in parallel.

## File structure

```
docker_cpu/
├── Dockerfile             # build instructions for the container
├── docker-compose.yml     # compose configuration
├── process_images.py      # script that removes backgrounds
├── README.md              # this file
├── input/                 # place input images here
└── output/                # processed images are written here
```

When deployed on the server copy the entire folder to
`/home/kucu/background-remover`.

## How it works

`process_images.py` loads the BRIAAI ONNX model using `onnxruntime`.
For each image it calculates an alpha mask and produces a PNG with a
transparent background. Multiple files can be processed at once using a
`ProcessPoolExecutor`.

The Dockerfile concatenates the split model files from `packages/model-briaai`
into `briaai.onnx` and installs minimal runtime dependencies.

## Usage

1. Copy this directory to `/home/kucu/background-remover` on the host and create
   input/output folders:
   ```bash
   mkdir -p /home/kucu/background-remover/input \
       /home/kucu/background-remover/output
   ```
2. From `/home/kucu/background-remover` build and start the container:
   ```bash
   docker compose up --build
   ```
3. Put images in the `input/` folder. Processed files appear in `output/` with
   the same name and `.png` extension.

### Manual run

```bash
docker build -t rmbg-cpu /home/kucu/background-remover

docker run --rm \
  -v /home/kucu/background-remover/input:/data/input \
  -v /home/kucu/background-remover/output:/data/output \
  rmbg-cpu python process_images.py /data/input/* -o /data/output
```
