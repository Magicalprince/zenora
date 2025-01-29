// Using Web Audio API to create a peaceful chime sound
const createChimeSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const playChime = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start with no volume
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    // Quickly fade in
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    // Slowly fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
    
    // Set frequency for peaceful chime sound
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.type = 'sine';
    
    // Start and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
    
    // Secondary harmonic
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
    
    harmonic.frequency.setValueAtTime(784.88, audioContext.currentTime); // G5
    harmonic.type = 'sine';
    
    harmonic.start(audioContext.currentTime + 0.1);
    harmonic.stop(audioContext.currentTime + 1.5);
  };

  return playChime;
};

window.playChimeSound = createChimeSound();
