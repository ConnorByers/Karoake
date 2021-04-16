import RecordButton from './RecordButton';
import UploadTrack from './UploadTrack';
import React, { useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import './style.css';
import './custom.css';

function App() {
  const [instrumentalId, setinstrumentalId] = useState(false);
  const [combinedUrl, setCombinedUrl] = useState('');
  return (
    <div className="container">
      {!instrumentalId && <UploadTrack setinstrumentalId={setinstrumentalId} />}
      {(instrumentalId && !combinedUrl) && <RecordButton instrumentalId={instrumentalId} setCombinedUrl={setCombinedUrl} />}
      {combinedUrl && <audio controls src={combinedUrl} />}
    </div>
  );
}

export default App;
