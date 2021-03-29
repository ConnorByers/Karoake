import RecordButton from './RecordButton';
import UploadTrack from './UploadTrack';
import React, { useState } from 'react';

function App() {
  const [instrumentalId, setinstrumentalId] = useState(false);
  return (
    <div className="App">
      <p>Hello</p>
      <UploadTrack setinstrumentalId={setinstrumentalId} />
      <RecordButton instrumentalId={instrumentalId} />
    </div>
  );
}

export default App;
