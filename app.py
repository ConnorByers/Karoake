import os
import time
from flask import (
    Flask, 
    render_template,
    request,
    flash,
    redirect,
    url_for,
    send_from_directory,
    make_response,
    jsonify,
    send_file,
    abort,
)
from consts import (
    UPLOAD_FOLDER
)
from flask_cors import CORS, cross_origin
import uuid
import logging
from pydub import AudioSegment
from spleeter.separator import Separator
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = ['Content-Type']
app.config['CORS_EXPOSE_HEADERS'] = 'file_name'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Maximum file upload size is 15MB
app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024

logging.basicConfig(level=logging.INFO)

separator = Separator('spleeter:2stems')

@app.route('/api/upload_track', methods=['POST'])
@cross_origin()
def upload_track():
    ''' Given a mp3 file, save it with a uuid as the file name and use spleeter to get the vocals and instrumental.
        Responds with the unique filename.
    '''
    file = request.files['customFile']
    if file.mimetype != 'audio/mpeg':
        abort(400)
    filename = str(uuid.uuid4())
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename + '.mp3'))
    separator.separate_to_file((os.path.join(app.config['UPLOAD_FOLDER'], filename + '.mp3')), './music/split/')
    return filename

@app.route('/api/upload_voice/<instrumental_id>', methods=['POST'])
@cross_origin()
def upload_voice(instrumental_id):
    ''' Given a vocal and the filename from uploading the track, respond with the vocals merged with instrumental
    '''
    file = request.files['file']
    filename = str(uuid.uuid4())
    if file.mimetype != 'audio/webm':
        abort(400)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename + '.webm'))
    sound1 = AudioSegment.from_file(os.path.join('./music/split/', instrumental_id, 'accompaniment.wav'), format="wav")
    sound2 = AudioSegment.from_file(os.path.join(app.config['UPLOAD_FOLDER'], filename + '.webm'), format="webm")
    overlay = sound1.overlay(sound2, position=0)
    merged_name = instrumental_id + '.mp3'
    file_handle = overlay.export(os.path.join("./music/merged/", merged_name), format="mp3")
    return send_file(
        os.path.join("./music/merged/", merged_name), 
        mimetype="audio/mpeg",
        as_attachment=True, 
        attachment_filename="output.mp3")
