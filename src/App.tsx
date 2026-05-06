import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WasteScanner from './components/WasteScanner';
import WasteTypes from './components/WasteTypes';
import ScanHistory from './components/ScanHistory';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WasteScanner />
      <WasteTypes />
      <ScanHistory />
      <Footer />
    </div>
  );
}
