import React, {useState} from 'react'
import axios from 'axios';
export default function UploadTrack(props) {
    const [uploadedTrack, setTrack] = useState(false);
    const [instrumentalURL, setInstrumentalURL] = useState(false);
    const onUpload = (e) => {
        setTrack(e.target.files[0]);
        console.log(uploadedTrack);
    };

    const onSubmit = (e) => {
        //console.log(uploadedTrack);
        let formData = new FormData();

        const blob = new Blob([uploadedTrack], {type: 'audio/mpeg'});

		formData.append('customFile', blob);

        axios.post('http://127.0.0.1:5000/upload_track', formData, {responseType: 'blob'})
        .then((result) => {
            console.log(result.headers);
            //const audioBlob = new Blob([result.data], {type: 'audio/wav'});
            const url = URL.createObjectURL(result.data);
            setInstrumentalURL(url);
            props.setinstrumentalId(result.headers['file_name'])
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div>
            <input type="file" name="file" onChange={onUpload} />
            <button onClick={onSubmit}>Upload</button>
            {instrumentalURL && 
                <audio controls src={instrumentalURL} />
            }
        </div>
    )
}
