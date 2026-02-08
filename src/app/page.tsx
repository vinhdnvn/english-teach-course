'use client';

import { useState, useEffect, useRef } from 'react';
import { unitsData } from '@/lib/data';

interface WrongAnswer {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
}

export default function Home() {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [mode, setMode] = useState<'alex_ask' | 'stu_ask'>('alex_ask');
  const [unit, setUnit] = useState(1);
  const [qIdx, setQIdx] = useState(0);
  const [alexSay, setAlexSay] = useState("Hello! I'm Alex.");
  const [userSay, setUserSay] = useState('Click START to talk!');
  const [isRecording, setIsRecording] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [showOrange, setShowOrange] = useState(false);
  const [modelText, setModelText] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [useTextInput, setUseTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const isStoppingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSpeechResultRef = useRef<(said: string) => void>(() => {});

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          const said = event.results[0][0].transcript;
          console.log('Recognized:', said);
          setUserSay(`You: "${said}"`);
          isStoppingRef.current = true;
          setIsRecording(false);
          handleSpeechResultRef.current(said);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          isStoppingRef.current = true;
          setIsRecording(false);

          if (event.error === 'not-allowed') {
            alert('Microphone permission denied. Switch to TEXT INPUT mode below.');
            setUseTextInput(true);
          } else if (event.error === 'network') {
            alert('Network error! Switching to TEXT INPUT mode. You can type your answer instead of speaking.');
            setUseTextInput(true);
          } else if (event.error === 'no-speech') {
            setUserSay('No speech detected. Please try again!');
          } else if (event.error === 'aborted') {
            console.log('Speech recognition aborted');
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          // Only restart if we didn't intentionally stop
          if (isRecording && !isStoppingRef.current) {
            console.log('Restarting recognition...');
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Failed to restart:', e);
              setIsRecording(false);
            }
          } else {
            setIsRecording(false);
          }
          isStoppingRef.current = false;
        };
      }
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Watch for mode and unit changes to update Alex's message
  useEffect(() => {
    resetApp();
  }, [mode, unit]);

  // Ensure alexSay always matches qIdx in alex_ask mode
  useEffect(() => {
    if (mode === 'alex_ask' && !isLoading && !showCert) {
      const currentQuestion = unitsData[unit]?.qa[qIdx];
      if (currentQuestion && alexSay !== currentQuestion.q) {
        // Sync alexSay with qIdx
        setAlexSay(currentQuestion.q);
        speak(currentQuestion.q);
      }
    }
  }, [qIdx, mode, unit, isLoading, showCert, alexSay]);

  const resetApp = () => {
    // Prevent user interaction during reset
    setIsLoading(true);

    // Clear any pending timeouts from previous answers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Stop any recording in progress
    if (isRecording && recognitionRef.current) {
      isStoppingRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Reset all state
    setQIdx(0);
    setShowCert(false);
    setShowOrange(false);
    setWrongAnswers([]);
    setInteractionCount(0);
    setUserSay('Click START to talk!');
    setTextInput('');

    // Update Alex's message based on mode
    if (mode === 'alex_ask') {
      const firstQuestion = unitsData[unit].qa[0].q;
      updateAlex(firstQuestion);
    } else {
      updateAlex(`I'm Alex! Ask me about ${unitsData[unit].n}`);
    }

    // Allow interaction after state updates complete
    setTimeout(() => setIsLoading(false), 200);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (!isRecording) {
      isStoppingRef.current = false;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
        alert('Could not start microphone. Please try again.');
        setIsRecording(false);
      }
    } else {
      isStoppingRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeechResult = async (said: string) => {
    if (mode === 'alex_ask') {
      await handleAlexAsk(said);
    } else {
      await handleStuAsk(said);
    }
  };
  // Keep speech handler in sync with latest state to avoid stale closures.
  handleSpeechResultRef.current = handleSpeechResult;

  const handleAlexAsk = async (said: string) => {
    setIsLoading(true);
    const currentQA = unitsData[unit].qa[qIdx];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'alex_ask',
          unit,
          question: currentQA.q,
          studentAnswer: said,
          expectedAnswer: currentQA.a,
        }),
      });

      const result = await response.json();

      if (result.correct) {
        setShowOrange(false);
        displayStars();
        playSuccess();
      } else {
        setShowOrange(true);
        setModelText(result.correctedAnswer || currentQA.a);
        // Chỉ lưu 1 câu sai gần nhất
        setWrongAnswers([{
          question: currentQA.q,
          studentAnswer: said,
          correctAnswer: result.correctedAnswer || currentQA.a,
        }]);
        playError();
      }

      timeoutRef.current = setTimeout(() => {
        // Calculate next index first
        const nextIdx = qIdx + 1;
        setQIdx(nextIdx);
        // Reset wrong answers khi chuyển câu hỏi mới
        setWrongAnswers([]);
        setShowOrange(false);

        if (unitsData[unit].qa[nextIdx]) {
          updateAlex(unitsData[unit].qa[nextIdx].q);
        } else {
          updateAlex('You are brilliant! 🌟');
          setTimeout(() => setShowCert(true), 1000);
        }
        timeoutRef.current = null;
      }, 3500);

    } catch (error) {
      console.error('Error:', error);
      updateAlex("Sorry, I had trouble understanding. Let's try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStuAsk = async (said: string) => {
    setIsLoading(true);

    // Increment và lấy giá trị mới
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'stu_ask',
          unit,
          studentAnswer: said,
        }),
      });

      const result = await response.json();

      if (result.error) {
        updateAlex("Sorry, I had trouble understanding. Can you ask me something else?");
      } else {
        updateAlex(result.aiAnswer || "I'm not sure about that. Can you ask me something else?");
        displayStars();
        playSuccess();

        // Hiện certificate sau 5 câu hỏi
        if (newCount >= 5) {
          setTimeout(() => setShowCert(true), 2000);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      updateAlex("Sorry, I didn't catch that. Could you ask again?");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlex = (text: string) => {
    setAlexSay(text);
    speak(text);
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const playModel = () => {
    speak(modelText);
  };

  const displayStars = () => {
    setShowStars(true);
    setTimeout(() => setShowStars(false), 1500);
  };

  const playSuccess = () => {
    // Simple success beep using Web Audio API
    if (typeof window !== 'undefined' && (window as any).AudioContext) {
      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const playError = () => {
    // Simple error beep
    if (typeof window !== 'undefined' && (window as any).AudioContext) {
      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 300;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const handleTextSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!textInput.trim() || isLoading) return;

    const said = textInput.trim();
    setUserSay(`You: "${said}"`);
    setTextInput('');
    handleSpeechResult(said);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-2.5 flex justify-center items-center font-[var(--font-lexend)]">
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[10px] border-[#333] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0d47a1] text-white p-6 text-center border-b-[6px] border-[#ffd700]">
          <h1 className="text-4xl font-black">ALEX SMART AI 26.0 🚀</h1>
        </div>

        {/* Setup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-5 bg-[#e3f2fd] relative z-10">
          <input
            type="text"
            placeholder="Student Name..."
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-4 rounded-xl border-[3px] border-[#1976d2] text-lg font-bold bg-white text-gray-900 placeholder:text-gray-500 cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Class..."
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="p-4 rounded-xl border-[3px] border-[#1976d2] text-lg font-bold bg-white text-gray-900 placeholder:text-gray-500 cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'alex_ask' | 'stu_ask')}
            className="p-4 rounded-xl border-[3px] border-[#1976d2] text-lg font-bold bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="alex_ask">Alex Asks (Alex hỏi)</option>
            <option value="stu_ask">Student Asks (Alex trả lời)</option>
          </select>
          <select
            value={unit}
            onChange={(e) => setUnit(Number(e.target.value))}
            className="p-4 rounded-xl border-[3px] border-[#1976d2] text-lg font-bold bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(unitsData).map((k) => (
              <option key={k} value={k}>
                Unit {k}: {unitsData[Number(k)].n}
              </option>
            ))}
          </select>
        </div>

        {/* Screen */}
        <div className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center relative">
          {showStars && (
            <div className="text-7xl mb-4 animate-pulse">⭐⭐⭐⭐⭐</div>
          )}
          <div className="text-5xl text-[#0d47a1] font-black leading-tight mb-8">
            {isLoading ? 'Thinking... 🤔' : alexSay}
          </div>
          <div className="text-3xl text-[#555] bg-white px-9 py-4 rounded-[50px] border-[4px] border-dashed border-[#1976d2]">
            {userSay}
          </div>
        </div>

        {/* Orange Error Box */}
        {showOrange && (
          <div
            onClick={playModel}
            className="bg-[#fff3e0] border-[5px] border-[#ff6d00] rounded-2xl p-5 mx-4 mb-4 cursor-pointer hover:bg-[#ffe0b2] transition-colors"
          >
            <b className="text-xl text-[#ff6d00]">⚠️ REPEAT AFTER ALEX:</b>
            <p className="text-4xl font-black text-[#bf360c] my-2">{modelText}</p>
            <p className="text-sm text-gray-600">Click to hear pronunciation</p>
          </div>
        )}

        {/* Wrong Answers List */}
        {wrongAnswers.length > 0 && !showCert && (
          <div className="mx-4 mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <h3 className="text-xl font-bold text-red-800 mb-3">📝 Review Your Mistakes:</h3>
            <div className="space-y-2">
              {wrongAnswers.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speak(item.correctAnswer)}
                  className="p-3 bg-white rounded-lg cursor-pointer hover:bg-red-100 transition-colors border border-red-200"
                >
                  <p className="text-sm font-semibold text-gray-700">Q: {item.question}</p>
                  <p className="text-sm text-red-600">❌ You said: {item.studentAnswer}</p>
                  <p className="text-sm text-green-600">✅ Correct: {item.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-8 text-center">
          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center gap-3">
            <button
              onClick={() => setUseTextInput(false)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                !useTextInput
                  ? 'bg-[#0d47a1] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎤 Voice Mode
            </button>
            <button
              onClick={() => setUseTextInput(true)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                useTextInput
                  ? 'bg-[#0d47a1] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ⌨️ Text Mode
            </button>
          </div>

          {/* Voice Input */}
          {!useTextInput && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMic();
                }}
                onMouseDown={(e) => e.preventDefault()}
                disabled={isLoading}
                type="button"
                className={`w-[350px] h-[90px] rounded-[45px] text-white text-3xl font-bold cursor-pointer transition-all select-none ${
                  isRecording
                    ? 'bg-[#d32f2f] animate-pulse'
                    : isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0d47a1] hover:bg-[#1565c0] active:scale-95'
                }`}
              >
                {isRecording ? '🔴 LISTENING...' : isLoading ? '⏳ THINKING...' : '🎙 START SPEAKING'}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                {isRecording ? 'Speak now... Click again to stop' : 'Click to start speaking'}
              </p>
            </>
          )}

          {/* Text Input */}
          {useTextInput && (
            <form onSubmit={handleTextSubmit} className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Type your answer here..."
                  className="flex-1 p-4 text-xl border-[3px] border-[#1976d2] rounded-xl font-bold text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || !textInput.trim()}
                  className={`px-8 py-4 rounded-xl text-xl font-bold text-white transition-all ${
                    isLoading || !textInput.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#0d47a1] hover:bg-[#1565c0] active:scale-95'
                  }`}
                >
                  {isLoading ? '⏳' : '✓ Send'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Type your answer and press Enter or click Send
              </p>
            </form>
          )}
        </div>

        {/* Certificate */}
        {showCert && (
          <div className="p-12 border-[25px] border-double border-[#ffd700] m-5 text-center bg-white">
            <div className="text-[100px]">🥇</div>
            <h2 className="font-[var(--font-dancing)] text-8xl text-[#0d47a1] my-4">
              CERTIFICATE
            </h2>
            <p className="text-3xl text-black font-semibold">Proudly presented to</p>
            <h2 className="text-6xl font-bold text-[#c62828] my-4">
              {studentName || 'Super Student'}
            </h2>
            <p className="text-4xl font-bold text-black my-4">
              Mastered Unit {unit}: {unitsData[unit].n}
            </p>
            {className && (
              <p className="text-2xl text-black font-semibold">Class: {className}</p>
            )}
            <p className="text-3xl text-[#2e7d32] italic font-semibold mt-8 mb-6">
              "Please talk to Alex every day to speak English better!"
            </p>
            <div className="flex justify-around mt-12 pt-6 border-t-2 border-dashed border-gray-400 text-2xl font-bold text-black">
              <div>Mrs. Tran Thi Kim Yen</div>
              <div>Mrs. Pham Thi Ngoc Bich</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
