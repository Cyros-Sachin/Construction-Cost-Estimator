import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EstimatorForm from './components/EstimatorForm';
import EstimationHistory from './components/EstimationHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EstimatorForm />} />
        <Route path="/history" element={<EstimationHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
