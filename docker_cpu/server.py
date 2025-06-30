import os
from io import BytesIO
from flask import Flask, request, send_file, abort
from PIL import Image
from process_images import preprocess, postprocess, load_session

app = Flask(__name__)

@app.post('/remove-bg')
def remove_bg():
    if 'file' not in request.files:
        abort(400, 'missing file')
    file = request.files['file']
    img = Image.open(file.stream)
    orig_size = img.size
    input_tensor = preprocess(img)
    session = load_session()
    output = session.run(None, {session.get_inputs()[0].name: input_tensor})[0]
    mask = postprocess(output, orig_size)
    img = img.convert('RGBA')
    img.putalpha(mask)
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8000'))
    app.run(host='0.0.0.0', port=port, threaded=True)
