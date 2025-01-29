import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import KnowYourself from './pages/KnowYourself';
import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [quote, setQuote] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);

  useEffect(() => {
    const getQuote = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = "Generate a short, inspiring quote about mental peace and well-being (max 15 words). Only return the quote, nothing else.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        setQuote(response.text());
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Find your inner peace, and the world becomes a better place.');
      }
    };
    getQuote();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionsRef.current) {
        const scrollPosition = sectionsRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const newActiveSection = Math.round(scrollPosition / windowHeight);
        
        setActiveSection(newActiveSection);
        
        // Check if quote section is visible
        const quoteSection = Math.floor(scrollPosition / windowHeight);
        setIsQuoteVisible(quoteSection === 2);
      }
    };

    const sectionsContainer = sectionsRef.current;
    if (sectionsContainer) {
      sectionsContainer.addEventListener('scroll', handleScroll);
      return () => sectionsContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (index) => {
    if (sectionsRef.current) {
      sectionsRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/know-yourself" element={<KnowYourself />} />
        <Route path="/" element={
          <div className="app-container">
            <nav className="floating-nav">
              <div className="logo-container">
                <span className="logo-text">Z</span>
                <span className="logo-text">e</span>
                <span className="logo-text">n</span>
                <span className="logo-text">o</span>
                <span className="logo-text">r</span>
                <span className="logo-text">a</span>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link active">
                  Home
                </Link>
                <Link to="/know-yourself" className="nav-link">
                  Know Yourself
                </Link>
                <a href="#music-therapy" className="nav-link">
                  Music as Drug
                </a>
              </div>
            </nav>

            <div className="sections-container" ref={sectionsRef}>
              <section className="hero-section">
                <div className="content-wrapper">
                  <div className="hero-text">
                    <h1 className="animated-title">
                      <span className="gradient-text">Welcome to</span>
                      <br />
                      <span className="gradient-text accent">Zenora</span>
                    </h1>
                    <p className="hero-description">Your personal sanctuary for mental wellness, combining the healing power of music with mindful guidance.</p>
                    <button className="cta-button">
                      <span className="button-text">Begin Your Journey</span>
                      <span className="button-icon">→</span>
                    </button>
                  </div>
                  <div className="hero-visual">
                    <div className="floating-shapes">
                      <div className="shape shape-1"></div>
                      <div className="shape shape-2"></div>
                      <div className="shape shape-3"></div>
                    </div>
                    <div className="mascot">
                      <div className="mascot-body">
                        <div className="mascot-eye left"></div>
                        <div className="mascot-eye right"></div>
                        <div className="mascot-smile"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="features-section">
                <div className="content-wrapper">
                  <h2 className="section-title">Your Path to Peace</h2>
                  <div className="features-grid">
                    <div className="feature-card">
                      <div className="feature-icon ai"></div>
                      <h3>Music Therapy</h3>
                      <p>Personalized musical journeys for emotional healing</p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon speed"></div>
                      <h3>Mindful Moments</h3>
                      <p>Guided meditation with soothing soundscapes</p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon custom"></div>
                      <h3>Emotional Support</h3>
                      <p>AI-powered companion for your mental wellness</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="quote-section">
                <div className="music-visualizer">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`circle-${i}`}
                      className="music-circle"
                    />
                  ))}
                  <div className="music-bars">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={`bar-${i}`}
                        className="music-bar"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          height: `${Math.random() * 60 + 20}px`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="quote-container">
                  <h2>Today's Wisdom</h2>
                  <p className="quote-text">{quote}</p>
                  <button 
                    className="cherish-button"
                    onClick={() => {
                      // Play chime sound
                      if (window.playChimeSound) {
                        window.playChimeSound();
                      }

                      const popper = document.createElement('div');
                      popper.className = 'music-popper';
                      
                      // Create music visualization
                      const visualizer = document.createElement('div');
                      visualizer.className = 'music-visualizer';
                      
                      // Add circles
                      for (let i = 0; i < 3; i++) {
                        const circle = document.createElement('div');
                        circle.className = 'music-circle';
                        visualizer.appendChild(circle);
                      }
                      
                      // Add bars
                      const bars = document.createElement('div');
                      bars.style.display = 'flex';
                      bars.style.gap = '4px';
                      for (let i = 0; i < 30; i++) {
                        const bar = document.createElement('div');
                        bar.className = 'music-bar';
                        bar.style.animationDelay = `${i * 0.1}s`;
                        bar.style.height = `${Math.random() * 60 + 20}px`;
                        bars.appendChild(bar);
                      }
                      visualizer.appendChild(bars);
                      
                      popper.appendChild(visualizer);
                      document.body.appendChild(popper);
                      
                      // Add auto-dismiss
                      setTimeout(() => popper.classList.add('active'), 0);
                      setTimeout(() => {
                        popper.classList.remove('active');
                        setTimeout(() => popper.remove(), 300);
                      }, 3000); // Dismiss after 3 seconds
                    }}
                  >
                    <span>Cherish this moment</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </button>
                </div>
              </section>
            </div>

            <div className="scroll-indicator">
              <div className={`dot ${activeSection === 0 ? 'active' : ''}`} onClick={() => scrollToSection(0)}></div>
              <div className={`dot ${activeSection === 1 ? 'active' : ''}`} onClick={() => scrollToSection(1)}></div>
              <div className={`dot ${activeSection === 2 ? 'active' : ''}`} onClick={() => scrollToSection(2)}></div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
