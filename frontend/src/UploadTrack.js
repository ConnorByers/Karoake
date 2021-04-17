import React, {useState} from 'react';
import { useAsync } from 'react-async';
import Loader from "react-loader-spinner";
import axios from 'axios';

export default function UploadTrack(props) {
    const [instrumentalURL, setInstrumentalURL] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const handleFileChange = async ([event]) => {
        console.log('here');
        setLoading(true);
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
            props.setinstrumentalId(result.headers['file_name']);
            return { success: 'True'};
        })
        .catch((error) => {
            console.error('Error:', error);
            return { success: 'False'};
        });
    };

    const { data, error, run } = useAsync({ deferFn: handleFileChange })
   
    const hiddenFileInput = React.useRef(null);
  
    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div>
        {isLoading ? <>
            <Loader
                type="Puff"
                color="#FFFFFF"
                height={150}
                width={150}
            />
            <p className="loadingText">
                Uploading...
            </p>
            </>
            :
            <>
                <p className="instructions">
                    Upload the mp3 of the song you want to sing over
                </p>
                <div className="line"></div>
                <div className="buttonwrapper">
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
                        onChange={run}
                        style={{display:'none'}} 
                    />
                </div>
            </>
        }   
        </div>
    )
}
