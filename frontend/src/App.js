import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DestinationDetail from './pages/DestinationDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-center text-blue-600 p-4">Bienvenido a ViajaFacil</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
