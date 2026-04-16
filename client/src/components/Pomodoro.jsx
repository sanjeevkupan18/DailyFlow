// // ================= FRONTEND (React Component) =================
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const PomodoroTimer = () => {
//   const FOCUS_TIME = 25 * 60; // 25 minutes
//   const BREAK_TIME = 5 * 60; // 5 minutes

//   const [time, setTime] = useState(FOCUS_TIME);
//   const [isRunning, setIsRunning] = useState(false);
//   const [mode, setMode] = useState("focus"); // focus or break

//   useEffect(() => {
//     let interval;
//     if (isRunning && time > 0) {
//       interval = setInterval(() => {
//         setTime((prev) => prev - 1);
//       }, 1000);
//     }

//     if (time === 0) {
//       handleSessionComplete();
//     }

//     return () => clearInterval(interval);
//   }, [isRunning, time]);

//   const handleSessionComplete = async () => {
//     setIsRunning(false);

//     try {
//       await axios.post("http://localhost:5001/api/focus-session", {
//         type: mode,
//         duration: mode === "focus" ? 25 : 5,
//         completed: true,
//       });
//     } catch (err) {
//       console.error(err);
//     }

//     if (mode === "focus") {
//       setMode("break");
//       setTime(BREAK_TIME);
//     } else {
//       setMode("focus");
//       setTime(FOCUS_TIME);
//     }
//   };

//   const handleStart = () => setIsRunning(true);
//   const handleStop = () => setIsRunning(false);

//   const handleReset = () => {
//     setIsRunning(false);
//     setMode("focus");
//     setTime(FOCUS_TIME);
//   };

//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min.toString().padStart(2, "0")}:${sec
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>{mode === "focus" ? "Focus Time" : "Break Time"}</h2>
//       <h1>{formatTime(time)}</h1>

//       <button onClick={handleStart}>Start</button>
//       <button onClick={handleStop}>Stop</button>
//       <button onClick={handleReset}>Reset</button>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus Time', duration: 25 * 60, color: 'primary' },
  break: { label: 'Break Time', duration: 5 * 60, color: 'green' },
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [time, setTime] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const total = MODES[mode].duration;
  const progress = ((total - time) / total) * 100;

  // Circle ring math
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => setRunning(true);
  const handleStop  = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setTime(MODES[mode].duration);
  };

  const switchMode = (m) => {
    setRunning(false);
    setMode(m);
    setTime(MODES[m].duration);
  };

  const ringColor = mode === 'focus' ? '#6366f1' : '#22c55e';
  const isDone = time === 0;

  return (
    <div className="card mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8">

      {/* Mode toggle */}
      <div className="flex w-full items-center gap-0.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/60">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            mode === 'focus'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Zap size={12} />
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            mode === 'break'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Coffee size={12} />
          Break
        </button>
      </div>

      {/* Ring + time */}
      <div className="relative flex items-center justify-center">
        <svg className="h-auto w-full max-w-[200px] sm:max-w-[220px]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={isDone ? '#22c55e' : ringColor}
            strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center">
          {isDone ? (
            <span className="text-3xl mb-1">🎉</span>
          ) : (
            <span
              className="text-3xl font-bold tabular-nums tracking-tight sm:text-4xl"
              style={{ color: isDone ? '#22c55e' : mode === 'focus' ? '#4f46e5' : '#16a34a' }}
            >
              {formatTime(time)}
            </span>
          )}
          <span className="text-xs text-slate-400 font-medium mt-1">
            {isDone ? 'Done!' : MODES[mode].label}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: isDone ? '#22c55e' : mode === 'focus' ? '#6366f1' : '#22c55e',
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleReset}
          className="btn-ghost p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={running ? handleStop : handleStart}
          disabled={isDone}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ background: mode === 'focus' ? '#6366f1' : '#22c55e' }}
        >
          {running
            ? <><Pause size={16} /> Pause</>
            : <><Play  size={16} /> {time === total ? 'Start' : 'Resume'}</>
          }
        </button>
      </div>

      {/* Session hint */}
      <p className="text-xs text-slate-300 text-center">
        {mode === 'focus'
          ? 'Stay focused — break coming soon'
          : 'Rest up — you earned it!'}
      </p>
    </div>
  );
}

// export default PomodoroTimer;
