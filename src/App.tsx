import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  MessageSquare, 
  User, 
  Phone, 
  PlusCircle, 
  ShieldAlert,
  Bot,
  CreditCard,
  Menu,
  X,
  Mic,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './views/Dashboard';
import Pricing from './views/Pricing';
import Reminders from './views/Reminders';
import Forum from './views/Forum';
import AIAssistant from './views/AIAssistant';
import Profile from './views/Profile';
import Notes from './views/Notes';
import { GoogleGenAI } from "@google/genai";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Activity, label: 'Giám sát' },
    { path: '/pricing', icon: CreditCard, label: 'Dịch vụ' },
    { path: '/reminders', icon: Calendar, label: 'Lịch hẹn' },
    { path: '/notes', icon: StickyNote, label: 'Ghi chú' },
    { path: '/forum', icon: MessageSquare, label: 'Cộng đồng' },
    { path: '/ai', icon: Bot, label: 'Trợ lý AI' },
    { path: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-brand-blue font-bold text-xl">HomeCare+</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 p-6 z-50">
        <h1 className="text-brand-blue font-black text-2xl mb-10">HomeCare+</h1>
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                location.pathname === item.path 
                  ? "bg-brand-blue text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
              YD
            </div>
            <div>
              <p className="font-semibold text-sm">Yen Dan</p>
              <p className="text-xs text-gray-400">Thành viên Gold</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex justify-around py-3 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.path ? "text-brand-blue" : "text-gray-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

const SOSButton = () => {
  const handleSOS = () => {
    window.location.href = "tel:0703430999";
  };

  return (
    <button 
      onClick={handleSOS}
      className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-[60] btn-sos"
    >
      <ShieldAlert size={24} />
      <span>SOS</span>
    </button>
  );
};

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Trình duyệt không hỗ trợ nhận dạng giọng nói.");
      return;
    }
    setIsListening(!isListening);
    // Implementation would go here
  };

  return (
    <button 
      onClick={toggleListening}
      className={cn(
        "fixed bottom-36 right-6 md:bottom-24 md:right-8 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
        isListening ? "bg-brand-green animate-pulse" : "bg-white text-brand-blue"
      )}
    >
      <Mic size={24} />
    </button>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg flex">
        <Navigation />
        <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </AnimatePresence>
        </main>
        <SOSButton />
        <VoiceControl />
      </div>
    </Router>
  );
}

import { cn } from './lib/utils';
