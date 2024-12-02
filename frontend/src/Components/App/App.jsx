// src/Components/App/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../Auth/AuthProvider';
import AppContent from './AppContent';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;