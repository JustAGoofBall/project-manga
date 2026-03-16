import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimeDetail from './pages/AnimeDetail';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/favorites" element={
              <PrivateRoute><Favorites /></PrivateRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
