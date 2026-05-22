import os
from flask import Flask, send_from_directory, make_response

app = Flask(__name__)
BASE = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return send_from_directory(BASE, 'index.html')

@app.route('/<path:path>')
def serve(path):
    fp = os.path.join(BASE, path)
    if not os.path.isfile(fp):
        return send_from_directory(BASE, 'index.html')
    ct = {'json':'application/manifest+json','png':'image/png'}.get(path.rsplit('.',1)[-1].lower())
    resp = make_response(send_from_directory(BASE, path))
    if ct: resp.headers['Content-Type'] = ct
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
