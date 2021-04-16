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
)
from consts import (
    UPLOAD_FOLDER
)
from utils import (
    allowed_file
)
from flask_cors import CORS, cross_origin
import uuid
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from spleeter.separator import Separator
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = ['Content-Type']
app.config['CORS_EXPOSE_HEADERS'] = 'file_name'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

separator = Separator('spleeter:2stems')

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            separator.separate_to_file((os.path.join(app.config['UPLOAD_FOLDER'], filename)), './music/split/')
            filename = filename.replace('.mp3', '')
            sound1 = AudioSegment.from_file(os.path.join('./music/split/', filename, 'accompaniment.wav'), format="wav")
            sound2 = AudioSegment.from_file('./vocals.wav', format="wav")
            overlay = sound1.overlay(sound2, position=0)
            file_handle = overlay.export(os.path.join("./static/","output.mp3"), format="mp3")
            return render_template('hello.html', name='Connor')
    return render_template('hello.html', name='Connor')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/upload_track', methods=['POST'])
@cross_origin()
def upload_track():
    file = request.files['customFile']
    filename = str(uuid.uuid4())
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename + '.mp3'))
    separator.separate_to_file((os.path.join(app.config['UPLOAD_FOLDER'], filename + '.mp3')), './music/split/')
    filename_with_ext = filename + '.wav'
    directory_name = os.path.join('./music/split/', filename,  'accompaniment.wav')
    # '/music/split/' + filename + '/accompaniment.wav'
    response = make_response(send_file(
         directory_name, 
         mimetype="audio/wav", 
         as_attachment=True, 
         attachment_filename=filename_with_ext))
    response.headers['file_name'] = filename
    return response

@app.route('/upload_voice/<instrumental_id>', methods=['POST'])
@cross_origin()
def upload_voice(instrumental_id):
    file = request.files['file']
    filename = str(uuid.uuid4())
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
