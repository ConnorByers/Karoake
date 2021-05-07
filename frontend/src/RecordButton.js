import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';
import Loader from "react-loader-spinner";
import AudioPlayer from 'react-h5-audio-player';
import { RESTAPI_URL } from './config';

function RecordButton({instrumentalId, setCombinedUrl, setError}) {
  const [recordingState, setRecordingState] = useState({
    hasMicAccess: null,
    isRecording: false,
    currentRecordingBlob: null,
    currentRecordingURL: null,
  });

  const [recorder, setRecorder] = useState(false);

  const [isFirstLoadOfPage, setLoadOfPage] = useState(true);

  const chunks = useRef([]);

  if (isFirstLoadOfPage) {
    setLoadOfPage(false);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then((microphoneStream)=>{
        const mediaRecorder = new MediaRecorder(microphoneStream);
        mediaRecorder.onstart = () => {
          setRecordingState({ ...recordingState, isRecording: true});
        }

        mediaRecorder.ondataavailable = (micDataEvent) => {
          chunks.current.push(micDataEvent.data);
        }

        mediaRecorder.onstop = () => {
          setRecordingState({
            ...recordingState,
            isRecording: false,
            currentRecordingBlob: chunks.current[0],
            currentRecordingURL: URL.createObjectURL(chunks.current[0])
          });
          chunks.current = [];
        }

        setRecorder(mediaRecorder);
      })
    } else {
      setRecordingState({...recordingState, hasMicAccess: false})
    }
  }

  const startRecording = () => {
    recorder.start();
  }

  const stopRecording = async () => {
    await recorder.stop();
  }

  const onSubmit = async () => {
    let formData = new FormData();
		formData.append('file', recordingState.currentRecordingBlob);

    return axios.post(`${RESTAPI_URL}/api/upload_voice/${instrumentalId}`, formData, {responseType: 'blob'})
      .then((result) => {
          const url = URL.createObjectURL(result.data);
          setCombinedUrl(url);
          return true;
      })
      .catch((error) => {
          setError(true);
          throw true;
      });
  }

  const { data, error, run, isPending } = useAsync({ deferFn: onSubmit })

  return <>
    {isPending ?
      <>
        <Loader
            type="Puff"
            color="#FFFFFF"
            height={150}
            width={150}
        />
        <p className="loadingText">
            Uploading...
        </p>
      </> :
      <div>
        <p className="instructions">
            Play the music in your ear and record yourself singing along to it
        </p>
        <div className="line"></div>
        <div className="buttonwrapper">
        <a
          onClick={recordingState.isRecording ? stopRecording : startRecording}
          className={recordingState.isRecording ? 'stopbutton' : 'recordbutton'}
        >
          {recordingState.isRecording ? 'Stop' : 'Record'}
        </a>
        {recordingState.currentRecordingURL && <AudioPlayer
          src={recordingState.currentRecordingURL}
          showJumpControls={false}
          layout="horizontal-reverse"
          customVolumeControls={[]}
          customAdditionalControls={[]}
        />}
        <a
          className="uploadbutton"
          onClick={run}
        >
          Submit
        </a>
        </div>
      </div>
    }
  </>

}

export default RecordButton;