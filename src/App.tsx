import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StarBackground from './components/StarBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Resume from './pages/Resume';
import ML from './pages/ML';
import FullStack from './pages/FullStack';
import Mobile from './pages/Mobile';
import Games from './pages/Games';
import Referrals from './pages/Referrals';
import Extensions from './pages/Extensions';
import MiniGame from './pages/MiniGame';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <StarBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/ml" element={<ML />} />
              <Route path="/full-stack" element={<FullStack />} />
              <Route path="/mobile" element={<Mobile />} />
              <Route path="/games" element={<Games />} />
              <Route path="/extensions" element={<Extensions />} />
              <Route path="/mini-game" element={<MiniGame />} />
              <Route path="/referrals" element={<Referrals />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;

