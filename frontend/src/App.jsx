import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Workspace from './pages/Workspace';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import BackButton from './components/BackButton';
import WalletAvatar from './components/WalletAvatar';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <BackButton />
      <WalletAvatar />
      <main className="page-frame">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
