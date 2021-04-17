import RecordButton from './RecordButton';
import UploadTrack from './UploadTrack';
import ResultPage from './ResultPage';
import AudioPlayer from 'react-h5-audio-player';
import React, { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './style.css';

function App() {
  const [instrumentalId, setinstrumentalId] = useState(false);
  const [combinedUrl, setCombinedUrl] = useState('');
  return (
    <div className="container">
      {!instrumentalId && <UploadTrack setinstrumentalId={setinstrumentalId} />}
      {(instrumentalId && !combinedUrl) && <RecordButton instrumentalId={instrumentalId} setCombinedUrl={setCombinedUrl} />}
      {combinedUrl && <ResultPage combinedUrl={combinedUrl} />}
    </div>
  );
}

export default App;
