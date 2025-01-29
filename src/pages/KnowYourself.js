import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './KnowYourself.css';

const MOODS = [
  { emoji: '😊', text: 'Happy', color: '#FFD93D' },
  { emoji: '😔', text: 'Sad', color: '#6B728E' },
  { emoji: '😌', text: 'Peaceful', color: '#98EECC' },
  { emoji: '😤', text: 'Angry', color: '#FF6B6B' },
  { emoji: '😰', text: 'Anxious', color: '#A084DC' },
  { emoji: '🤗', text: 'Grateful', color: '#FFB84C' }
];

const MAX_MEMORY_LENGTH = 20; // Increased memory length

// Advanced Therapeutic Intervention Library
const TherapeuticInterventions = {
  anxiety: {
    techniques: [
      {
        name: 'Grounding Exercise',
        description: 'A 5-4-3-2-1 sensory grounding technique to reduce anxiety',
        steps: [
          'Acknowledge 5 things you can see',
          'Notice 4 things you can touch',
          'Listen to 3 sounds around you',
          'Identify 2 things you can smell',
          'Recognize 1 thing you can taste'
        ]
      },
      {
        name: 'Cognitive Reframing',
        description: 'Transform negative thoughts into constructive perspectives',
        steps: [
          'Identify the anxious thought',
          'Challenge its validity',
          'Reframe with a balanced, realistic view',
          'Visualize a positive outcome'
        ]
      },
      {
        name: 'Progressive Muscle Relaxation',
        description: 'Systematic tension and relaxation of muscle groups',
        steps: [
          'Start from toes, progressively tense and relax muscles',
          'Move upward through legs, abdomen, arms, and face',
          'Focus on the difference between tension and relaxation',
          'Practice deep, slow breathing'
        ]
      }
    ],
    affirmations: [
      "Your anxiety doesn't define you. You are stronger than your fears.",
      "This moment of anxiety is temporary. You have the power to navigate through it.",
      "Every challenge is an opportunity for growth and self-discovery.",
      "Your worth is not determined by a single presentation or moment."
    ],
    coping_strategies: [
      "Break your presentation into smaller, manageable sections",
      "Practice deep breathing before and during preparation",
      "Visualize a successful, confident presentation",
      "Prepare a comfort kit: water, notes, stress ball",
      "Use positive self-talk and gentle encouragement"
    ]
  },
  // Additional emotional states can be added similarly
};

const KnowYourself = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoods, setShowMoods] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced conversation context
  const [conversationContext, setConversationContext] = useState({
    currentMood: '',
    conversationHistory: [],
    emotionalJourney: [],
    conversationHighlights: [],
    userPreferences: {},
    interventionTracker: {}
  });

  const chatRef = useRef(null);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setShowMoods(false);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(mood);
      setMessages([{ type: 'ai', text: response }]);
    } catch (error) {
      console.error('Error in initial response:', error);
      setMessages([{ 
        type: 'ai', 
        text: "I'm here to listen and support you. How are you feeling? 💜" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (mood, userMessage = '') => {
    try {
      const moodKey = mood.text.toLowerCase();
      
      // Ensure conversation context is properly initialized
      if (!conversationContext.conversationHistory) {
        setConversationContext(prev => ({
          ...prev,
          conversationHistory: [],
          currentMood: moodKey,
          interventionTracker: {}
        }));
      }

      if (userMessage) {
        // Prepare comprehensive conversation history
        const conversationHistory = conversationContext.conversationHistory || [];
        const recentHistory = conversationHistory.slice(-5).map(msg => 
          `${msg.type}: ${msg.text}`
        ).join('\n');

        // Track and rotate interventions to ensure uniqueness
        const interventionTracker = conversationContext.interventionTracker || {};
        const currentInterventions = TherapeuticInterventions[moodKey] || {};
        
        // Select unique intervention
        const selectUniqueIntervention = (type) => {
          const options = currentInterventions[type] || [];
          const usedIndices = interventionTracker[type] || [];
          
          const availableIndices = options
            .map((_, index) => index)
            .filter(index => !usedIndices.includes(index));
          
          if (availableIndices.length === 0) {
            // Reset tracking if all interventions used
            interventionTracker[type] = [];
            return options[0];
          }
          
          const selectedIndex = availableIndices[
            Math.floor(Math.random() * availableIndices.length)
          ];
          
          interventionTracker[type] = [...(interventionTracker[type] || []), selectedIndex];
          return options[selectedIndex];
        };

        // Generate dynamic, unique response
        const prompt = `Therapeutic Conversation Context:
- Current Emotional State: ${moodKey}
- Recent Conversation History:
${recentHistory}

User's Current Message: "${userMessage}"

Intervention Objectives:
1. Provide a unique, emotionally intelligent response
2. Offer a specific, actionable therapeutic technique
3. Use empathetic, personalized language
4. Generate under 100 words
5. Include a practical coping strategy

Unique Intervention Selected:
${JSON.stringify(selectUniqueIntervention('techniques'))}

Affirmation to Incorporate:
${selectUniqueIntervention('affirmations')}

Coping Strategy:
${selectUniqueIntervention('coping_strategies')}

Generate a response that:
- Validates emotions
- Provides a specific intervention
- Offers hope and practical support
- Feels fresh and personalized`;

        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        // Update comprehensive conversation context
        setConversationContext(prev => {
          const updatedHistory = [
            ...(prev.conversationHistory || []),
            { type: 'user', text: userMessage, timestamp: Date.now() },
            { type: 'ai', text: response, timestamp: Date.now() }
          ].slice(-20);

          return {
            ...prev,
            conversationHistory: updatedHistory,
            currentMood: moodKey,
            interventionTracker: interventionTracker
          };
        });

        return response;
      }

      // Initial response with advanced mood-specific approach
      const prompt = `Generate a deeply empathetic, professionally supportive initial greeting:
- Mood: ${moodKey}
- Demonstrate psychological understanding
- Offer immediate emotional validation
- Provide a sense of professional support
- Create a safe, trusting environment
- Under 70 words`;

      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Update conversation context for initial mood
      setConversationContext(prev => ({
        ...prev,
        conversationHistory: [
          ...(prev.conversationHistory || []),
          { type: 'ai', text: response, timestamp: Date.now() }
        ],
        currentMood: moodKey
      }));

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm here with professional support, ready to help you navigate this moment with compassion and expertise 💫";
    }
  };

  const handleUserResponse = async (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const userMessage = event.target.value.trim();
      event.target.value = '';

      // Prevent multiple responses while processing
      if (isLoading) return;

      // Add user's message to conversation
      setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
      setIsLoading(true);

      try {
        // Get single AI response
        const response = await generateAIResponse(selectedMood, userMessage);

        // Add only one AI response to conversation
        setMessages(prev => [...prev, { type: 'ai', text: response }]);
      } catch (error) {
        console.error('Error in conversation:', error);
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: "I'm here to listen. Would you like to share more about how you're feeling? 💜" 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="app-container">
      <nav className="floating-nav">
        <div className="logo-container">
          {'ZENORA'.split('').map((letter, index) => (
            <span key={index} className="logo-text">{letter}</span>
          ))}
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/know-yourself" className="nav-link active">Know Yourself</Link>
          <Link to="/music-as-drug" className="nav-link">Music as Drug</Link>
        </div>
      </nav>

      <div className="know-yourself-container">
        <div className="floating-hearts">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        <div className="companion-container">
          <div className="companion">
            <div className="companion-face">
              <div className="companion-eye left"></div>
              <div className="companion-eye right"></div>
              <div className="companion-mouth"></div>
            </div>
          </div>
        </div>

        {showMoods ? (
          <div className="mood-container">
            <h2>How are you feeling today?</h2>
            <div className="mood-buttons">
              {MOODS.map((mood, index) => (
                <button
                  key={index}
                  className="mood-button"
                  style={{ backgroundColor: mood.color }}
                  onClick={() => handleMoodSelect(mood)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-text">{mood.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-container">
            <div className="chat-messages" ref={chatRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                onKeyPress={handleUserResponse}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowYourself;
