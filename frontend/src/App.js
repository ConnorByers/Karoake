import RecordButton from './RecordButton';
import UploadTrack from './UploadTrack';
import ResultPage from './ResultPage';
import ErrorPage from './ErrorPage';
import AudioPlayer from 'react-h5-audio-player';
import React, { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './style.css';

function App() {
  const [instrumentalId, setInstrumentalId] = useState(false);
  const [combinedUrl, setCombinedUrl] = useState('');
  const [hasError, setError] = useState(false);
  return (
    <div className="container">
      {hasError ? <ErrorPage /> :
        <>
          {!instrumentalId && <UploadTrack setInstrumentalId={setInstrumentalId} setError={setError} />}
          {(instrumentalId && !combinedUrl) && <RecordButton instrumentalId={instrumentalId} setCombinedUrl={setCombinedUrl} setError={setError} />}
          {combinedUrl && <ResultPage combinedUrl={combinedUrl} />}
        </>
      }
      
    </div>
  );
}

export default App;
