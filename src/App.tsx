import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Feira from './routes/Feira';
import Recrutador from './routes/Recrutador';
import RecrutadorIndex from './routes/RecrutadorIndex';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feira" element={<Feira />} />
      <Route path="/recrutador" element={<RecrutadorIndex />} />
      <Route path="/recrutador/:slug" element={<Recrutador />} />
    </Routes>
  );
}
