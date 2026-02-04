import React, { useState, useEffect } from 'react';
import { ArtWork, QuizQuestion } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { generateQuizQuestion } from '../services/geminiService';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizPage: React.FC = () => {
  const [currentArtwork, setCurrentArtwork] = useState<ArtWork | null>(null);
  const [questionData, setQuestionData] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Load new question
  const loadNewQuestion = async () => {
    setIsLoading(true);
    setIsAnswered(false);
    setSelectedOption(null);
    setQuestionData(null);

    // Pick random artwork
    const randomArt = ARTWORKS_DATA[Math.floor(Math.random() * ARTWORKS_DATA.length)];
    setCurrentArtwork(randomArt);

    // Generate Question via AI
    const quizQ = await generateQuizQuestion(randomArt);
    setQuestionData(quizQ);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    setTotalQuestions(prev => prev + 1);

    if (questionData && index === questionData.correctIndex) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-mnac-cream flex flex-col md:flex-row overflow-hidden relative">
      
      {/* LEFT: Artwork Context */}
      <div className="w-full md:w-1/3 h-1/3 md:h-full relative overflow-hidden bg-black flex-shrink-0">
        {currentArtwork ? (
           <>
             <img 
               src={currentArtwork.imageUrl} 
               alt="Quiz Context" 
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
             <div className="absolute bottom-8 left-8 text-white z-10">
               <span className="bg-mnac-red px-2 py-1 text-[9px] font-bold uppercase tracking-widest mb-2 inline-block">
                 Obra de referencia
               </span>
               {/* Hide title in quiz? Maybe show it as hint? Let's show it for context */}
               <h3 className="font-sans font-bold text-2xl md:text-4xl leading-none mb-1 opacity-50 blur-[4px] hover:blur-0 transition-all cursor-help duration-500">
                  {currentArtwork.title}
               </h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  (Pasa el ratón para revelar)
               </p>
             </div>
           </>
        ) : (
           <div className="w-full h-full bg-gray-900 animate-pulse"></div>
        )}
      </div>

      {/* RIGHT: Quiz Interface */}
      <div className="w-full md:w-2/3 h-2/3 md:h-full flex flex-col relative bg-mnac-cream">
         
         {/* Top Bar - Now relative to prevent overlapping */}
         <div className="w-full p-6 md:p-12 flex justify-between items-start z-20 flex-shrink-0 bg-mnac-cream">
            <Link to="/" className="text-mnac-dark hover:text-mnac-red transition-colors">
               <span className="font-black text-xl tracking-tighter">MNAC</span>
            </Link>
            
            <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
               <div className="flex flex-col items-end">
                  <span className="text-[9px]">Aciertos</span>
                  <span className="text-mnac-dark">{score}/{totalQuestions}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px]">Racha</span>
                  <span className={`${streak > 2 ? 'text-mnac-gold animate-bounce' : 'text-mnac-dark'}`}>
                     {streak} 🔥
                  </span>
               </div>
            </div>
         </div>

         {/* Question Container */}
         <div className="flex-1 flex flex-col px-6 md:px-24 max-w-4xl mx-auto w-full overflow-y-auto pb-6">
            {isLoading || !questionData ? (
               <div className="flex flex-col items-center justify-center gap-4 py-12 m-auto">
                  <RefreshCw className="animate-spin text-mnac-red" size={48} />
                  <p className="font-sans font-medium text-xl text-gray-400 animate-pulse">Generando desafío con IA...</p>
               </div>
            ) : (
               <div className="animate-pop-in py-4 my-auto">
                  <div className="flex items-center gap-3 mb-6 text-mnac-red">
                     <BrainCircuit size={24} />
                     <span className="text-xs font-bold uppercase tracking-widest">Desafío Selectividad</span>
                  </div>
                  
                  <h2 className="font-sans font-bold text-2xl md:text-4xl text-mnac-dark mb-10 leading-snug">
                     {questionData.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     {questionData.options.map((option, idx) => {
                        let btnClass = "border border-gray-200 hover:border-mnac-dark hover:bg-gray-50 text-gray-600";
                        if (isAnswered) {
                           if (idx === questionData.correctIndex) btnClass = "bg-green-100 border-green-500 text-green-800";
                           else if (idx === selectedOption) btnClass = "bg-red-50 border-red-500 text-red-800";
                           else btnClass = "opacity-50 border-gray-100";
                        }
                        
                        return (
                           <button
                              key={idx}
                              onClick={() => handleOptionClick(idx)}
                              disabled={isAnswered}
                              className={`p-6 text-left rounded-lg text-sm md:text-base font-medium transition-all duration-300 flex items-center justify-between group ${btnClass}`}
                           >
                              <span>{option}</span>
                              {isAnswered && idx === questionData.correctIndex && <CheckCircle2 size={20} className="text-green-600" />}
                              {isAnswered && idx === selectedOption && idx !== questionData.correctIndex && <XCircle size={20} className="text-red-600" />}
                           </button>
                        );
                     })}
                  </div>

                  {isAnswered && (
                     <div className="animate-slide-up">
                        <div className={`p-6 rounded-lg mb-8 flex gap-4 ${selectedOption === questionData.correctIndex ? 'bg-mnac-gold/10' : 'bg-gray-100'}`}>
                           <Trophy className={selectedOption === questionData.correctIndex ? 'text-mnac-gold' : 'text-gray-400'} size={24} />
                           <div>
                              <span className="text-xs font-bold uppercase tracking-widest block mb-1">
                                 {selectedOption === questionData.correctIndex ? '¡Correcto!' : 'Respuesta Correcta:'}
                              </span>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                 {questionData.explanation}
                              </p>
                           </div>
                        </div>

                        <button 
                           onClick={loadNewQuestion}
                           className="bg-mnac-dark text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-mnac-red transition-all flex items-center gap-3 shadow-lg"
                        >
                           Siguiente Pregunta <ArrowRight size={16} />
                        </button>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default QuizPage;