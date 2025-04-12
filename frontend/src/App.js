import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EstimationHistory from './components/EstimationHistory';
import LandingPage from './components/LandingPage';
import EstimatorForm from './components/EstimatorForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/estimate" element={<EstimatorForm />} />
        <Route path="/history" element={<EstimationHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
