import { useState, useEffect } from 'react';

export default function SchedulerDemo() {
  const [screen, setScreen] = useState('initial');
  const [messages, setMessages] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [animateMaria, setAnimateMaria] = useState(false);
  const [dashboardStatus, setDashboardStatus] = useState('No-Show');
  const [showChatUI, setShowChatUI] = useState(false);
  const [showFinger, setShowFinger] = useState({ target: null, visible: false });
  const [fadeOut, setFadeOut] = useState(false);

  const startSequence = () => {
    setShowChatUI(true);
    setMessages([{
      id: 1,
      text: 'Hi Maria, we missed you today. Tap below to reschedule.',
      timestamp: 'Thursday 8:25 AM'
    }]);
  };

  const resetDemo = () => {
    setFadeOut(true);
    setTimeout(() => {
      setScreen('initial');
      setAppointment(null);
      setDashboardStatus('No-Show');
      setShowChatUI(false);
      setShowFinger({ target: null, visible: false });
      setFadeOut(false);
      setTimeout(() => startSequence(), 1000);
    }, 1000);
  };

  useEffect(() => {
    if (screen === 'initial') {
      const showChatTimeout = setTimeout(() => {
        startSequence();
      }, 2000);
      return () => clearTimeout(showChatTimeout);
    }
  }, [screen]);

  useEffect(() => {
    if (messages.find(m => m.id === 1) && !messages.find(m => m.id === 2)) {
      const clickTimeout = setTimeout(() => {
        setShowFinger({ target: 'book', visible: true });
        setTimeout(() => {
          setShowFinger({ target: null, visible: false });
          handleRescheduleClick();
        }, 1000);
      }, 3000);
      return () => clearTimeout(clickTimeout);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.find(m => m.id === 2) && !messages.find(m => m.id === 3)) {
      const selectTimeout = setTimeout(() => {
        setShowFinger({ target: 'friday', visible: true });
        setTimeout(() => {
          setShowFinger({ target: null, visible: false });
          handleTimeSelect('Friday at 2:00 PM');
        }, 1000);
      }, 2500);
      return () => clearTimeout(selectTimeout);
    }
  }, [messages]);

  useEffect(() => {
    const audio = document.getElementById('bg-music');
    audio.volume = 0.3;
    const enableAudio = () => {
      audio?.play().catch(() => {});
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);
  }, []);

  const handleRescheduleClick = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 2,
        text: 'Please select a new appointment time:',
        timestamp: 'Thursday 8:26 AM'
      }]);
    }, 800);
  };

  const handleTimeSelect = (time) => {
    setAppointment(time);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 3,
        text: `✅ Your appointment is now set for ${time}.`,
        timestamp: 'Thursday 8:27 AM'
      }]);
      setDashboardStatus('Rescheduled');
      setAnimateMaria(true);
      setTimeout(() => setAnimateMaria(false), 2000);
      setTimeout(() => resetDemo(), 3000);
    }, 1000);
  };

  return (
    <div className={`w-full h-screen bg-gray-50 flex items-center justify-center p-4 relative transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <audio autoPlay loop id="bg-music">
        <source src="/celebrate-your-wins.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full lg:w-1/2">
          <h2 className="text-lg font-bold mb-4">Naveon Care Clinic Scheduling Dashboard</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-2">Patient</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className={dashboardStatus === 'Rescheduled' ? "bg-green-100 transition duration-1000" : "bg-red-100 transition duration-1000"}>
                <td className="font-medium">Maria Lopez</td>
                <td className={dashboardStatus === 'Rescheduled' ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{dashboardStatus}</td>
                <td>{dashboardStatus === 'Rescheduled' ? appointment : '—'}</td>
              </tr>
              <tr>
                <td>James Lee</td>
                <td className="text-black font-semibold">Confirmed</td>
                <td>Wednesday at 3:00 PM</td>
              </tr>
            </tbody>
          </table>
        </div>

        {showChatUI && (
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full lg:w-1/2 flex flex-col animate-fade-in relative">
            <p className="text-gray-600 mb-2">From: <strong>Naveon Care Clinic</strong></p>
            <div className="space-y-4 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className="text-center animate-fade-in">
                  <p className="text-xs text-gray-400 mb-1">{msg.timestamp}</p>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl max-w-xs shadow text-left leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {messages.find(m => m.id === 1) && messages.length === 1 && (
                <div className="text-center mt-2 relative">
                  <button
                    id="book"
                    onClick={handleRescheduleClick}
                    className="relative bg-green-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-700"
                  >
                    Book New Time
                    {showFinger.visible && showFinger.target === 'book' && (
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mt-1 text-5xl animate-bounce">👆</span>
                    )}
                  </button>
                </div>
              )}

              {messages.find(m => m.id === 2) && !messages.find(m => m.id === 3) && (
                <div className="text-center space-y-2 relative">
                  <button id="thursday" onClick={() => handleTimeSelect('Thursday at 10:30 AM')} className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Thursday at 10:30 AM</button>
                  <div className="relative">
                    <button id="friday" onClick={() => handleTimeSelect('Friday at 2:00 PM')} className="relative w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                      Friday at 2:00 PM
                      {showFinger.visible && showFinger.target === 'friday' && (
                        <>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mt-1 animate-ping w-4 h-4 rounded-full bg-blue-300 opacity-50"></div>
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mt-1 text-5xl animate-bounce">👆</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}