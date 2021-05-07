import React, {useState} from 'react';
import { useAsync } from 'react-async';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { RESTAPI_URL } from './config';

export default function UploadTrack(props) {
    const [invalidInputType, setInvalidInputType] = useState(false);
    const handleFileChange = async ([event]) => {
        const fileUploaded = event.target.files[0];

        if (fileUploaded.type !== 'audio/mpeg') {
            setInvalidInputType(true);

            return Promise.resolve(true);
        } else {
            setInvalidInputType(false);
        }

        let formData = new FormData();

        const blob = new Blob([fileUploaded], {type: 'audio/mpeg'});

		formData.append('customFile', blob);
        
        return axios.post(`${RESTAPI_URL}/api/upload_track`, formData)
        .then((result) => {
            props.setInstrumentalId(result.data);
            return true;
        })
        .catch((error) => {
            props.setError(true);
            throw true;
        });
    
    };

    const { data, error, run, isPending } = useAsync({ deferFn: handleFileChange })
   
    const hiddenFileInput = React.useRef(null);
  
    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div>
        {isPending ? <>
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
                {invalidInputType &&
                    <p className="errormessage">
                        Invalid File Type. Upload a .mp3
                    </p>
                }
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
