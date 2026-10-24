import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const POP_CULTURE_CATEGORIES = [11, 14, 15, 16, 29, 31, 32];

export default function TriviaGame() {
  const { addTickets } = usePlayer();
  
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState([]);
  
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hasFetched = useRef(false);

  const fetchWithRetry = async (url, retries = 4, delay = 2500) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        const data = await response.json();
        if (data.response_code === 5) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (data.response_code === 0 && data.results.length > 0) return data;
        throw new Error("No results found");
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchQuestionsBatch = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const randomCategory = POP_CULTURE_CATEGORIES[Math.floor(Math.random() * POP_CULTURE_CATEGORIES.length)];
    const url = `https://opentdb.com/api.php?amount=10&type=multiple&category=${randomCategory}`;
    
    try {
      const data = await fetchWithRetry(url);
      if (data && data.results) loadNextFromQueue(data.results);
    } catch (error) {
      setTimeout(fetchQuestionsBatch, 3000); 
    }
  };

  const loadNextFromQueue = (queue) => {
    if (!queue || queue.length === 0) {
      fetchQuestionsBatch();
      return;
    }

    const nextQ = queue[0];
    const remainingQueue = queue.slice(1);
    
    setQuestionsQueue(remainingQueue);
    setQuestionData(nextQ);
    
    const allAnswers = [...nextQ.incorrect_answers, nextQ.correct_answer];
    setAnswers(allAnswers.sort(() => Math.random() - 0.5));
    
    setIsCorrect(false);
    setWrongAnswers([]);
    setLoading(false);
    setIsTransitioning(false); 
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchQuestionsBatch();
      hasFetched.current = true;
    }
  }, []);

  const handleNextLevel = () => {
    setIsTransitioning(true);
    setTimeout(() => loadNextFromQueue(questionsQueue), 600);
  };

  const handleAnswerClick = (answer) => {
    if (isCorrect || wrongAnswers.includes(answer) || isTransitioning) return;
    
    if (answer === questionData.correct_answer) {
      setIsCorrect(true);
      const basePoints = questionData.difficulty === 'hard' ? 30 : questionData.difficulty === 'medium' ? 20 : 10;
      const penalty = Math.floor(basePoints / 3); 
      const earnedPoints = Math.max(1, basePoints - (wrongAnswers.length * penalty));
      
      addTickets(earnedPoints);
    } else {
      setWrongAnswers(prev => [...prev, answer]);
    }
  };

  const getButtonClass = (answer) => {
    if (isCorrect && answer === questionData.correct_answer) return "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105"; 
    if (wrongAnswers.includes(answer)) return "bg-red-900/30 border-red-800/50 text-slate-500 opacity-50 cursor-not-allowed line-through"; 
    // Προστέθηκε το cursor-not-allowed στα κλειδωμένα κουμπιά
    if (isCorrect || isTransitioning) return "bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-50 cursor-not-allowed"; 
    // Προστέθηκε το cursor-pointer στα ενεργά κουμπιά
    return "bg-slate-800 border-slate-600 hover:border-purple-400 hover:bg-slate-700 text-slate-200 hover:-translate-y-1 shadow-lg cursor-pointer"; 
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 flex flex-col items-center">
      <div className="flex justify-between w-full mb-6 px-4">
        <h2 className="text-3xl font-bold text-purple-400 arcade-font">BrainGlitch</h2>
        <div className="text-sm font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-yellow-400">
          WIN TICKETS 🎟️
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full flex flex-col items-center shadow-lg backdrop-blur-sm min-h-[400px] justify-center relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-400 text-sm font-bold tracking-widest uppercase animate-pulse">Booting BrainGlitch...</p>
          </div>
        ) : questionData && (
          <div className={`w-full flex flex-col transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider mb-6 text-slate-400">
              <span className="bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">{decodeHTML(questionData.category)}</span>
              <span className="px-3 py-1 rounded-full border text-green-400 border-green-500/30 bg-green-900/40">{questionData.difficulty}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center leading-relaxed drop-shadow-md">
              {decodeHTML(questionData.question)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  disabled={isCorrect || wrongAnswers.includes(answer) || isTransitioning}
                  className={`px-6 py-4 rounded-xl border-2 font-medium text-lg transition-all duration-300 ${getButtonClass(answer)}`}
                >
                  {decodeHTML(answer)}
                </button>
              ))}
            </div>
            {isCorrect && !isTransitioning && (
              <button onClick={handleNextLevel} className="mx-auto mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] ">
                Next Level
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}