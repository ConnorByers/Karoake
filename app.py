import os
from flask import (
    Flask, 
    render_template,
    request,
    flash,
    redirect,
    url_for,
    send_from_directory
)
from consts import (
    UPLOAD_FOLDER
)
from utils import (
    allowed_file
)
from werkzeug.utils import secure_filename

from spleeter.separator import Separator
app = Flask(__name__)
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
            separator.separate_to_file((os.path.join(app.config['UPLOAD_FOLDER'], filename)), (os.path.join('./music/split/', filename)))
            return render_template('hello.html', name='Connor')
    return render_template('hello.html', name='Connor')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)