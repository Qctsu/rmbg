import argparse
import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image
import onnxruntime as ort

MODEL_PATH = Path(__file__).with_name('briaai.onnx')

session = None

def load_session():
    global session
    if session is None:
        session = ort.InferenceSession(str(MODEL_PATH), providers=['CPUExecutionProvider'])
    return session

def preprocess(image: Image.Image, size=1024) -> np.ndarray:
    image = image.convert('RGB')
    image = image.resize((size, size), Image.LANCZOS)
    arr = np.array(image).astype('float32')
    arr = (arr - 128) / 256
    arr = arr.transpose(2,0,1)[None, :, :, :]
    return arr

def postprocess(alpha: np.ndarray, orig_size) -> Image.Image:
    alpha = alpha.squeeze()
    alpha = (alpha * 255).clip(0,255).astype('uint8')
    mask = Image.fromarray(alpha, 'L').resize(orig_size, Image.LANCZOS)
    return mask

def process_file(path: str, output_dir: str, size=1024):
    img = Image.open(path)
    orig_size = img.size
    input_tensor = preprocess(img, size)
    sess = load_session()
    output = sess.run(None, {sess.get_inputs()[0].name: input_tensor})[0]
    mask = postprocess(output, orig_size)
    img = img.convert('RGBA')
    img.putalpha(mask)
    out_path = Path(output_dir) / (Path(path).stem + '.png')
    img.save(out_path)
    return str(out_path)

def main():
    parser = argparse.ArgumentParser(description='Batch background removal using briaai model')
    parser.add_argument('files', nargs='+', help='Input image files')
    parser.add_argument('-o', '--output', default='output', help='Output directory')
    parser.add_argument('--workers', type=int, default=os.cpu_count() or 1, help='Number of parallel workers')
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)
    with ProcessPoolExecutor(max_workers=args.workers) as exe:
        futures = [exe.submit(process_file, f, args.output) for f in args.files]
        for future in futures:
            try:
                print('Saved', future.result())
            except Exception as e:
                print('Failed processing', e)

if __name__ == '__main__':
    main()
