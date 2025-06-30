FROM python:3.10-slim
WORKDIR /app
COPY packages/model-briaai/*.onnx ./
RUN cat briaai-*.onnx > briaai.onnx && rm briaai-*.onnx
COPY docker_cpu/process_images.py ./process_images.py
COPY docker_cpu/server.py ./server.py
RUN pip install --no-cache-dir onnxruntime pillow numpy flask
ENTRYPOINT ["python", "server.py"]
