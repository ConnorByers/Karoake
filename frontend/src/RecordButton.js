import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAsync } from 'react-async';
import AudioPlayer from 'react-h5-audio-player';

function RecordButton({instrumentalId, setCombinedUrl}) {
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
    console.log(recordingState.currentRecordingBlob);
		formData.append('file', recordingState.currentRecordingBlob);

    axios.post(`http://127.0.0.1:5000/upload_voice/${instrumentalId}`, formData, {responseType: 'blob'})
      .then((result) => {
          const url = URL.createObjectURL(result.data);
          setCombinedUrl(url);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  return <>
    <div>
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
        onClick={onSubmit}
      >
        Submit
      </a>
    </div>
  </>

}

export default RecordButton;