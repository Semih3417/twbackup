import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const scrollRef = useRef(); // Zum automatischen Scrollen nach unten

  const [conversations, setConversations] = useState([]); // Linke Liste
  const [activeChat, setActiveChat] = useState(null); // Aktuell ausgewählter User
  const [messages, setMessages] = useState([]); // Rechte Liste
  const [input, setInput] = useState(''); // Textfeld
  const [loading, setLoading] = useState(true);

  // 1. Initialisierung: Konversationen laden & Check ob "Start Chat" gedrückt wurde
  useEffect(() => {
    loadConversations();
    
    // Wurde "Nachricht schreiben" auf einer Detailseite geklickt?
    if (location.state?.startChatWith) {
      const partner = location.state.startChatWith; // { user_id, first_name }
      setActiveChat(partner);
      // Wir fügen ihn temporär zur Liste hinzu, falls er noch nicht existiert
      setConversations(prev => {
        if (prev.find(c => c.user_id === partner.user_id)) return prev;
        return [{ user_id: partner.user_id, first_name: partner.first_name, last_message_time: new Date() }, ...prev];
      });
    }
  }, [location.state]);

  // 2. Wenn sich der aktive Chat ändert -> Nachrichten laden
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.user_id);
      // Optional: Polling (alle 5 Sekunden neue Nachrichten holen)
      const interval = setInterval(() => loadMessages(activeChat.user_id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  // 3. Automatisch nach unten scrollen bei neuen Nachrichten
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await client.get('/conversations');
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await client.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const tempMsg = { content: input, type: 'me', created_at: new Date() };
    setMessages([...messages, tempMsg]); // Optimistic UI
    setInput('');

    try {
      await client.post('/messages', {
        receiver_id: activeChat.user_id,
        content: tempMsg.content
      });
      loadMessages(activeChat.user_id); // Reload für echte IDs/Zeitstempel
      loadConversations(); // Damit die linke Liste nach oben rutscht
    } catch (err) {
      alert("Senden fehlgeschlagen");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      <div className="flex flex-grow overflow-hidden max-w-7xl mx-auto w-full border-t border-slate-100">
        
        {/* === LINKS: CHAT LISTE === */}
        <div className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 font-bold text-slate-700 bg-white">
            Nachrichten
          </div>
          <div className="overflow-y-auto flex-grow">
            {loading ? (
               <div className="p-4 text-slate-400 text-sm">Lade Chats...</div>
            ) : conversations.length === 0 ? (
               <div className="p-8 text-center text-slate-400">
                 <div className="text-4xl mb-2">💬</div>
                 <p>Noch keine Nachrichten.</p>
                 <p className="text-xs mt-2">Starte einen Chat über ein Fahrzeuginserat.</p>
               </div>
            ) : (
              conversations.map(c => (
                <div 
                  key={c.user_id}
                  onClick={() => setActiveChat(c)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition border-b border-slate-100 ${activeChat?.user_id === c.user_id ? 'bg-white border-l-4 border-l-brand-primary' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                    {c.first_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{c.first_name} {c.last_name}</div>
                    <div className="text-xs text-slate-400">Klicken zum Öffnen</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === RECHTS: CHAT FENSTER === */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-500 mr-2">
                   ← Zurück
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                  {activeChat.first_name.charAt(0)}
                </div>
                <div className="font-bold text-slate-800">{activeChat.first_name}</div>
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.length === 0 && <div className="text-center text-slate-400 text-sm mt-10">Schreib die erste Nachricht an {activeChat.first_name}! 👋</div>}
                
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.type === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${m.type === 'me' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input 
                    className="flex-grow border border-slate-200 rounded-full px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
                    placeholder="Nachricht schreiben..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <button type="submit" className="bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-slate-800 transition shadow-lg">
                    ➤
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-300">
               <div className="text-6xl mb-4 opacity-50">💬</div>
               <p>Wähle einen Chat aus der Liste.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}