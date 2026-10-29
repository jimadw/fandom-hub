import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext'; 
import { westerosLocations } from '../data/westerosLocations'; 

export default function WesterosMap() {
  const { addTickets } = usePlayer();
  const mapRef = useRef(null);
  
  const [rounds, setRounds] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(15);
  
  const [guessPos, setGuessPos] = useState(null);
  const [distance, setDistance] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', tickets: 0 });

  const startGame = () => {
    const shuffled = [...westerosLocations].sort(() => 0.5 - Math.random());
    setRounds(shuffled.slice(0, 5));
    setCurrentRoundIndex(0);
    startRound();
  };

  const startRound = () => {
    setGuessPos(null);
    setDistance(null);
    setFeedback({ message: '', tickets: 0 });
    setTimeLeft(15);
    setStatus('playing');
  };

  useEffect(() => {
    if (status !== 'playing') return;
    
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleTimeOut = () => {
    setStatus('revealed');
    setDistance(null);
    setFeedback({ message: "Time's up! The Night King is near.", tickets: 0 });
  };

  const handleMapClick = (e) => {
    if (status !== 'playing') return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setGuessPos({ x: clickX, y: clickY });
    
    const target = rounds[currentRoundIndex];
    const dx = clickX - target.x;
    const dy = clickY - target.y;
    const rawDist = Math.sqrt(dx * dx + dy * dy);
    
    setDistance(rawDist);
    calculateScore(rawDist);
    setStatus('revealed');
  };

  const calculateScore = (dist) => {
    let msg = '';
    let tix = 0;

    if (dist < 2) {
      msg = "Three-Eyed Raven Sight!";
      tix = 100;
    } else if (dist <= 8) {
      msg = "A True Ranger of the North.";
      tix = 60;
    } else if (dist <= 15) {
      msg = "Right kingdom, wrong castle.";
      tix = 20;
    } else {
      msg = "Lost in the wilderness. The Night King is near.";
      tix = 0;
    }

    setFeedback({ message: msg, tickets: tix });
    if (tix > 0) addTickets(tix);
  };

  const nextRound = () => {
    if (currentRoundIndex + 1 >= 5) {
      setStatus('finished');
    } else {
      setCurrentRoundIndex(prev => prev + 1);
      startRound();
    }
  };

  const target = rounds[currentRoundIndex];
  const progressPercent = (timeLeft / 15) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center px-4">
      {status === 'idle' && (
        <div className="text-center bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-amber-500 mb-4 arcade-font">Westeros Mapper</h2>
          <p className="text-slate-300 mb-8">Locate 5 strongholds across the Seven Kingdoms.</p>
          <button onClick={startGame} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
            Start Campaign
          </button>
        </div>
      )}

      {(status === 'playing' || status === 'revealed') && target && (
        <div className="w-full flex flex-col items-center bg-slate-900 border border-slate-700 p-6 rounded-3xl shadow-xl">
          
          {/* Header γύρου & Στόχος */}
          <div className="w-full max-w-3xl flex justify-between items-center mb-4 text-slate-300 font-bold px-2">
            <span>Round {currentRoundIndex + 1} / 5</span>
            <span className="text-amber-500 text-xl">{timeLeft}s</span>
          </div>

          {/* DYNAMIC TOP BAR: Deixnei h ton stoxo h ta apotelesmata */}
          <div className="w-full max-w-3xl min-h-[100px] flex flex-col justify-center mb-4">
            {status === 'playing' ? (
              <div className="text-center animate-fade-in">
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Locate:</p>
                <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {target.name}
                </h3>
              </div>
            ) : (
              <div className="bg-slate-800/80 border border-slate-600 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between w-full animate-fade-in shadow-lg">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  {distance !== null ? (
                    <p className="text-lg text-slate-200 mb-1">
                      Missed by: <span className="font-bold text-red-400">{Math.floor(distance * 10)} Leagues</span>
                    </p>
                  ) : (
                    <p className="text-lg text-red-500 font-bold mb-1">Time Expired!</p>
                  )}
                  <p className="text-sm italic text-slate-400">{feedback.message}</p>
                </div>
                
                <div className="flex flex-row items-center gap-6">
                  <p className="text-2xl font-bold text-amber-400 drop-shadow-md">
                    +{feedback.tickets} <span className="text-sm">TIX</span>
                  </p>
                  <button onClick={nextRound} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:scale-105">
                    Next Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wildfire Timer Bar */}
          <div className="w-full max-w-3xl h-2 bg-slate-800 rounded-full overflow-hidden mb-6 shadow-inner">
            <div 
              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Χάρτης - Arxhko Megalo Megethos */}
          <div className="relative w-full max-w-3xl border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl bg-black">
            <img 
              ref={mapRef}
              src="/westeros-blank-map.png"
              alt="Westeros Map" 
              className={`w-full h-auto object-cover select-none transition-opacity duration-300 ${status === 'playing' ? 'cursor-crosshair hover:opacity-95' : 'opacity-80'}`}
              onClick={handleMapClick}
              draggable={false}
            />

            {/* Marker Παίκτη */}
            {guessPos && (
              <div 
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,1)] -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${guessPos.x}%`, top: `${guessPos.y}%` }}
              />
            )}

            {/* Πραγματικό Marker (Στόχος) */}
            {status === 'revealed' && (
              <div 
                className="absolute w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
              />
            )}

            {/* SVG Γραμμή Απόστασης */}
            {status === 'revealed' && guessPos && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                <line 
                  x1={`${guessPos.x}%`} y1={`${guessPos.y}%`} 
                  x2={`${target.x}%`} y2={`${target.y}%`} 
                  stroke="white" strokeWidth="2" strokeDasharray="5,5" 
                  className="opacity-70 drop-shadow-md"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {status === 'finished' && (
        <div className="text-center bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-amber-500 mb-4">Campaign Complete</h2>
          <p className="text-slate-300 mb-8">You have proven your knowledge of the realm.</p>
          <button onClick={startGame} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}