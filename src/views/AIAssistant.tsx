import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  BrainCircuit, 
  Stethoscope, 
  PlayCircle,
  ChevronRight,
  Mic,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const ScreeningModule = () => {
  const [data, setData] = useState({
    age: '',
    weight: '',
    height: '',
    glucose: '',
    bloodPressure: '',
    familyHistory: 'no'
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScreening = async () => {
    setLoading(true);
    try {
      const model = "gemini-3-flash-preview";
      const prompt = `Dựa trên các chỉ số sau, hãy đánh giá nguy cơ đái tháo đường (chỉ mang tính chất tham khảo y tế sớm):
      Tuổi: ${data.age}, Cân nặng: ${data.weight}kg, Chiều cao: ${data.height}cm, Đường huyết: ${data.glucose}mg/dL, Huyết áp: ${data.bloodPressure}, Tiền sử gia đình: ${data.familyHistory}.
      Hãy trả về đánh giá ngắn gọn, lời khuyên và mức độ nguy cơ (Thấp/Trung bình/Cao).`;
      
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      setResult(response.text || "Không thể nhận kết quả.");
    } catch (error) {
      console.error(error);
      setResult("Có lỗi xảy ra khi phân tích.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">AI Sàng lọc sớm Đái tháo đường</h3>
          <p className="text-sm text-gray-400">Dựa trên 6 chỉ số đầu vào quan trọng.</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" placeholder="Tuổi" 
              className="p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20"
              onChange={(e) => setData({...data, age: e.target.value})}
            />
            <input 
              type="number" placeholder="Cân nặng (kg)" 
              className="p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20"
              onChange={(e) => setData({...data, weight: e.target.value})}
            />
            <input 
              type="number" placeholder="Chiều cao (cm)" 
              className="p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20"
              onChange={(e) => setData({...data, height: e.target.value})}
            />
            <input 
              type="number" placeholder="Đường huyết" 
              className="p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20"
              onChange={(e) => setData({...data, glucose: e.target.value})}
            />
          </div>
          <button 
            onClick={handleScreening}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? "Đang phân tích..." : "Bắt đầu sàng lọc AI"}
          </button>
        </div>
      ) : (
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <h4 className="font-bold text-orange-800 mb-2">Kết quả phân tích AI:</h4>
          <p className="text-orange-700 text-sm leading-relaxed mb-4">{result}</p>
          <button onClick={() => setResult(null)} className="text-orange-600 text-sm font-bold underline">Làm lại</button>
        </div>
      )}
    </div>
  );
};

const RehabLibrary = () => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <PlayCircle className="text-brand-blue" />
      Thư viện Hướng dẫn Phục hồi
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: 'Kỹ thuật nuốt an toàn', duration: '12:45', level: 'Cơ bản' },
        { title: 'Bài tập vận động chi trên', duration: '15:20', level: 'Trung bình' },
        { title: 'Hướng dẫn chăm sóc vết loét', duration: '08:10', level: 'Chuyên gia' },
        { title: 'Bài tập thở sau hậu phẫu', duration: '10:30', level: 'Cơ bản' }
      ].map((video, idx) => (
        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-32 h-20 bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
            <PlayCircle className="text-white z-10 opacity-0 group-hover:opacity-100 transition-all" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 group-hover:text-brand-blue transition-all">{video.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-400">{video.duration}</span>
              <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{video.level}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Xin chào! Tôi là Trợ lý Y tế AI của HomeCare Plus. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const model = "gemini-3-flash-preview";
      const response = await ai.models.generateContent({
        model,
        contents: input,
        config: {
          systemInstruction: "Bạn là trợ lý y tế chuyên nghiệp của HomeCare Plus. Hãy trả lời các câu hỏi về sức khỏe một cách ân cần, chính xác dựa trên kiến thức y khoa. Luôn nhắc nhở người dùng tham khảo ý kiến bác sĩ cho các trường hợp khẩn cấp. Trả lời bằng tiếng Việt."
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Xin lỗi, tôi không thể trả lời lúc này." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Đã có lỗi xảy ra. Vui lòng thử lại sau." }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trợ lý AI Y tế</h1>
        <p className="text-gray-500">Tư vấn sức khỏe 24/7 và sàng lọc bệnh lý sớm bằng trí tuệ nhân tạo.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Section */}
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-brand-blue p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <p className="font-bold">AI Consultation</p>
                <p className="text-xs text-blue-100">Trực tuyến 24/7</p>
              </div>
            </div>
            <Sparkles size={20} className="text-yellow-300 animate-pulse" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'ai' 
                    ? "bg-gray-100 text-gray-800 self-start rounded-tl-none" 
                    : "bg-brand-blue text-white self-end ml-auto rounded-tr-none"
                )}
              >
                {msg.text}
              </motion.div>
            ))}
            {isTyping && (
              <div className="bg-gray-100 text-gray-400 p-4 rounded-2xl self-start rounded-tl-none text-xs animate-pulse">
                AI đang suy nghĩ...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <button className="p-3 text-gray-400 hover:text-brand-blue">
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi của bạn..." 
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-brand-blue/20"
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-brand-blue text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-6">
          <ScreeningModule />
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-3xl p-6">
            <h4 className="font-bold text-brand-blue mb-4 flex items-center gap-2">
              <Stethoscope size={18} />
              Telehealth Video Call
            </h4>
            <p className="text-sm text-gray-600 mb-4">Kết nối trực tiếp với bác sĩ chuyên khoa qua cuộc gọi video chất lượng cao.</p>
            <button className="w-full btn-primary py-3 text-sm">
              <span>Bắt đầu cuộc gọi</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <RehabLibrary />
      </div>
    </div>
  );
}
