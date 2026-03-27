import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Volume2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { Reminder } from '../types';
import { cn } from '../lib/utils';

const initialReminders: Reminder[] = [
  { 
    id: '1', 
    type: 'medication', 
    title: 'Uống thuốc huyết áp (Amlodipine)', 
    time: '08:00', 
    completed: true,
    voicePrompt: 'Đã đến giờ uống thuốc huyết áp, thưa bác Dan.'
  },
  { 
    id: '2', 
    type: 'exercise', 
    title: 'Tập vật lý trị liệu (Bài tập tay)', 
    time: '10:30', 
    completed: false,
    voicePrompt: 'Bác Dan ơi, hãy cùng thực hiện bài tập tay trong 15 phút nhé.'
  },
  { 
    id: '3', 
    type: 'appointment', 
    title: 'Tái khám định kỳ tại Bạch Mai', 
    time: '14:00', 
    completed: false 
  },
  { 
    id: '4', 
    type: 'medication', 
    title: 'Uống thuốc tiểu đường (Metformin)', 
    time: '18:30', 
    completed: false 
  }
];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const playVoice = (prompt: string) => {
    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.lang = 'vi-VN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch nhắc cá nhân</h1>
          <p className="text-gray-500">Tuân thủ điều trị là chìa khóa để phục hồi nhanh chóng.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          <span>Thêm nhắc nhở</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {reminders.map((reminder, idx) => (
          <motion.div 
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-6 transition-all",
              reminder.completed ? "border-brand-green/20 bg-brand-green/5" : "border-gray-100"
            )}
          >
            <button 
              onClick={() => toggleComplete(reminder.id)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                reminder.completed ? "bg-brand-green text-white" : "border-2 border-gray-200 text-gray-300"
              )}
            >
              {reminder.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                  reminder.type === 'medication' ? "bg-blue-100 text-blue-600" :
                  reminder.type === 'exercise' ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                )}>
                  {reminder.type === 'medication' ? 'Thuốc' : 
                   reminder.type === 'exercise' ? 'Tập luyện' : 'Lịch khám'}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {reminder.time}
                </span>
              </div>
              <h3 className={cn(
                "text-xl font-bold transition-all",
                reminder.completed ? "text-gray-400 line-through" : "text-gray-900"
              )}>
                {reminder.title}
              </h3>
            </div>

            {reminder.voicePrompt && (
              <button 
                onClick={() => playVoice(reminder.voicePrompt!)}
                className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-blue hover:text-white transition-all"
              >
                <Volume2 size={20} />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Tỷ lệ tuân thủ</p>
          <p className="text-4xl font-black text-brand-blue">92%</p>
          <p className="text-xs text-brand-green mt-1 font-medium">Tốt hơn tuần trước 5%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Đã hoàn thành</p>
          <p className="text-4xl font-black text-gray-900">12/14</p>
          <p className="text-xs text-gray-400 mt-1">Nhiệm vụ trong ngày</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Chuỗi ngày</p>
          <p className="text-4xl font-black text-orange-500">15</p>
          <p className="text-xs text-gray-400 mt-1">Ngày liên tiếp hoàn thành</p>
        </div>
      </div>
    </div>
  );
}
