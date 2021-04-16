import React, {useState} from 'react'
import axios from 'axios';

export default function UploadTrack(props) {
    const [instrumentalURL, setInstrumentalURL] = useState(false);
   
    const hiddenFileInput = React.useRef(null);
  
    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    const handlFileChange = async (event) => {
        const fileUploaded = event.target.files[0];
        
        let formData = new FormData();

        const blob = new Blob([fileUploaded], {type: 'audio/mpeg'});

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
    };

    return (
        <div>
            <a
                onClick={handleFileClick}
                target="_blank"
                rel="noopener"
                className="uploadbutton"
            >
                Select Your Track
            </a>
            <input
                type="file"
                name="file"
                ref={hiddenFileInput}
                onChange={handlFileChange}
                style={{display:'none'}} 
            /> 
        </div>
    )
}
