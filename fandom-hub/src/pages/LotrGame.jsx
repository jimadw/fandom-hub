import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { fetchCharacters, fetchQuotes } from '../data/lotrApi';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const LotrGame = () => {
  const { addTickets } = usePlayer();
  
  const [gameState, setGameState] = useState('loading'); 
  const [charMap, setCharMap] = useState({});
  const [charList, setCharList] = useState([]);
  const [sessionQuotes, setSessionQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [options, setOptions] = useState([]);
  
  const [guessedOptions, setGuessedOptions] = useState([]);
  const [isRoundWon, setIsRoundWon] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); }
  }, []);

  useEffect(() => {
    const initGame = async () => {
      const charsData = await fetchCharacters();
      const quotesData = await fetchQuotes();

      if (charsData && quotesData) {
        setCharMap(charsData.charMap);
        setCharList(charsData.charList);
        const shuffledQuotes = shuffleArray(quotesData);
        setSessionQuotes(shuffledQuotes);
        generateOptions(shuffledQuotes[0], charsData.charMap, charsData.charList);
        setGameState('playing');
      }
    };
    initGame();
  }, []);

  const generateOptions = (quote, currentMap = charMap, currentList = charList) => {
    const correctId = quote.character;
    const wrongChars = currentList.filter(c => c._id !== correctId);
    const shuffledWrong = shuffleArray(wrongChars).slice(0, 3);
    const newOptions = [
      { id: correctId, name: currentMap[correctId] },
      ...shuffledWrong.map(c => ({ id: c._id, name: c.name }))
    ];
    setOptions(shuffleArray(newOptions));
    setGuessedOptions([]);
    setIsRoundWon(false);
  };

  const handleAnswer = (optionId) => {
    if (isRoundWon || guessedOptions.includes(optionId)) return; 

    const isCorrect = optionId === sessionQuotes[currentQuoteIndex].character;
    const newGuessedOptions = [...guessedOptions, optionId];
    setGuessedOptions(newGuessedOptions);

    if (isCorrect) {
      setIsRoundWon(true);
      
      const mistakes = newGuessedOptions.length - 1;
      let ticketsToAward = 0;
      
      if (mistakes === 0) ticketsToAward = 10;
      else if (mistakes === 1) ticketsToAward = 5;
      else if (mistakes === 2) ticketsToAward = 2;

      if (ticketsToAward > 0) {
        addTickets(ticketsToAward);
      }

      // Auto-advance meta apo 2 defterolepta
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = (currentQuoteIndex + 1) % sessionQuotes.length;
    setCurrentQuoteIndex(nextIndex);
    generateOptions(sessionQuotes[nextIndex]);
  };

  if (gameState === 'loading') {
    return (
      <div className="w-full max-w-4xl mx-auto mt-20 text-center animate-fade-in">
        <div className="text-xl text-green-400 arcade-font animate-pulse">Summoning data from Middle-earth...</div>
      </div>
    );
  }

  const currentQuote = sessionQuotes[currentQuoteIndex];
  const medievalFont = { fontFamily: "'MedievalSharp', cursive" };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 md:mt-16 animate-fade-in px-4 mb-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 
          className="text-2xl md:text-3xl font-bold text-green-500 tracking-widest drop-shadow-lg"
          style={medievalFont}
        >
          Wisdom<span className="text-white">OfMiddleEarth</span>
        </h1>
        
        <div className="bg-[#1a1721]/80 border border-white/10 text-yellow-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
          WIN TICKETS 🎟️
        </div>
      </div>

      {/* Main Karta xwris ta tags p pleon akyrwthikan */}
      <div className="bg-[#15111c] border border-white/5 p-6 md:p-10 rounded-[2rem] shadow-2xl flex flex-col relative">
        
        {/* Erotisi (Quote) */}
        <div className="min-h-[120px] flex items-center justify-center mb-10">
          <h3 
            className="text-2xl md:text-4xl text-center text-white leading-snug drop-shadow-md"
            style={medievalFont}
          >
            "{currentQuote?.dialog}"
          </h3>
        </div>

        {/* Grid Me tis apantiseis (Ksanampike to medievalFont sta buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isGuessed = guessedOptions.includes(opt.id);
            const isCorrect = opt.id === currentQuote.character;
            
            let btnClass = "bg-[#212633] border-white/10 text-white hover:bg-[#2a3040] hover:border-white/30 cursor-pointer";
            
            if (isGuessed) {
              if (isCorrect) {
                btnClass = "bg-green-600/30 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-default"; 
              } else {
                btnClass = "bg-[#181a24] border-transparent text-slate-500 opacity-50 cursor-not-allowed"; 
              }
            } else if (isRoundWon) {
              btnClass = "bg-[#181a24] border-transparent text-slate-500 opacity-50 cursor-default"; 
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={isRoundWon || isGuessed}
                style={medievalFont}
                className={`py-4 px-6 rounded-2xl transition-all duration-300 border text-lg tracking-wide ${btnClass}`}
              >
                {opt.name === "MINOR_CHARACTER" ? "Unknown Elf/Orc" : opt.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LotrGame;