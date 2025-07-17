import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
   const [activeLight, setActiveLight] = useState('red');
   const [carPosition, setCarPosition] = useState(0);
   const [running, setRunning] = useState(true);
   const [timeLeft, setTimeLeft] = useState(3);
   const [volume, setVolume] = useState(50);

   const hornRef = useRef(new Audio('/horn.mp3'));
   const signalTimerRef = useRef(null);
   const carTimerRef = useRef(null);

   // Set horn volume
   useEffect(() => {
      hornRef.current.volume = volume / 100;
   }, [volume]);

   // Start or stop intervals based on `running`
   useEffect(() => {
      // Stop existing intervals
      clearInterval(signalTimerRef.current);
      clearInterval(carTimerRef.current);

      if (!running) return;

      // Traffic light logic
      signalTimerRef.current = setInterval(() => {
         setTimeLeft(prev => {
            if (prev === 1) {
               setActiveLight(prevLight => {
                  let next = 'red';
                  if (prevLight === 'red') next = 'green';
                  else if (prevLight === 'green') next = 'yellow';

                  if (next === 'green') hornRef.current.play();
                  return next;
               });
               return 3;
            }
            return prev - 1;
         });
      }, 1000);

      // Car movement logic
      carTimerRef.current = setInterval(() => {
         setCarPosition(prev => {
            if (prev > 1100) return 0;
            if (activeLight === 'green') return prev + 10;
            if (activeLight === 'yellow') return prev + 1;
            return prev;
         });
      }, 100);

      return () => {
         clearInterval(signalTimerRef.current);
         clearInterval(carTimerRef.current);
      };
   }, [running, activeLight]); // Restart timers on change

   return (
      <>
         <div className="traffic-light">
            <button onClick={() => setRunning(prev => !prev)}>
               {running ? '🛑 STOP' : '▶️ START'}
            </button>

            <div className={`light red ${activeLight === 'red' ? 'on' : ''}`}>
               {activeLight === 'red' && <span>{timeLeft}</span>}
            </div>
            <div className={`light yellow ${activeLight === 'yellow' ? 'on' : ''}`}>
               {activeLight === 'yellow' && <span>{timeLeft}</span>}
            </div>
            <div className={`light green ${activeLight === 'green' ? 'on' : ''}`}>
               {activeLight === 'green' && <span>{timeLeft}</span>}
            </div>

            <div className="volume-control">
               🔊 Volume:
               <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
               />
               {volume}%
            </div>
         </div>

         <div className="scenery">
            🌳 🌳 🌴 🏠 🌲
            <div className="road">
               <div className="car flip" style={{ left: `${carPosition}px` }}>🚗</div>
               <div className="car flip" style={{ left: `${carPosition - 120}px`, top: '60px' }}>🚙</div>
            </div>
         </div>
      </>
   );
}

export default App;
