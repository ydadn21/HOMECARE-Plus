import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Search, 
  Filter, 
  Award,
  Plus,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { ForumPost } from '../types';
import { cn } from '../lib/utils';

const initialPosts: ForumPost[] = [
  {
    id: '1',
    author: 'BS. Nguyễn Văn An',
    content: 'Kỹ thuật nuốt an toàn cho bệnh nhân sau đột quỵ: Hãy đảm bảo bệnh nhân ngồi thẳng 90 độ và thức ăn được xay nhuyễn phù hợp với cấp độ IDDSI.',
    likes: 45,
    replies: 12,
    timestamp: '2 giờ trước',
    isExpert: true
  },
  {
    id: '2',
    author: 'Chị Lan (Người nhà)',
    content: 'Gia đình mình vừa sử dụng dịch vụ phục hồi chức năng tại nhà của HomeCare Plus. Kỹ thuật viên rất nhiệt tình, bố mình đã có thể tự đứng dậy sau 2 tuần tập luyện.',
    likes: 28,
    replies: 5,
    timestamp: '5 giờ trước'
  },
  {
    id: '3',
    author: 'Điều dưỡng Minh',
    content: 'Cách phòng ngừa loét tì đè cho người già nằm lâu: Thay đổi tư thế mỗi 2 giờ và sử dụng đệm hơi chuyên dụng.',
    likes: 56,
    replies: 8,
    timestamp: '1 ngày trước',
    isExpert: true
  }
];

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Diễn đàn Cộng đồng</h1>
        <p className="text-gray-500">Nơi chia sẻ kinh nghiệm và kết nối với các chuyên gia y tế.</p>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kinh nghiệm, bài viết..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-white border border-gray-100 rounded-xl flex items-center gap-2 text-gray-600 font-medium">
            <Filter size={18} />
            <span>Lọc</span>
          </button>
          <button className="btn-primary">
            <Plus size={18} />
            <span>Đăng bài</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['Tất cả', 'Phục hồi chức năng', 'Chăm sóc người già', 'Dinh dưỡng', 'Hỏi đáp chuyên gia'].map((cat, idx) => (
          <button 
            key={idx}
            className={cn(
              "whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all",
              idx === 0 ? "bg-brand-blue text-white shadow-md" : "bg-white text-gray-500 hover:bg-gray-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-brand-blue">
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{post.author}</h4>
                    {post.isExpert && (
                      <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award size={10} />
                        CHUYÊN GIA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-brand-blue">
                <Share2 size={20} />
              </button>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              {post.content}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all">
                <Heart size={18} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-all">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">{post.replies}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Clubs */}
      <div className="mt-12 bg-gradient-to-r from-brand-green to-emerald-600 rounded-3xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Câu lạc bộ Sức khỏe</h3>
        <p className="text-emerald-50 mb-6">Tham gia các nhóm sinh hoạt chung để giảm bớt sự cô đơn và duy trì tinh thần lạc quan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <h4 className="font-bold mb-1">CLB Yoga Người cao tuổi</h4>
            <p className="text-xs text-emerald-100">Họp mặt: Sáng Thứ 2, 4, 6 hàng tuần</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <h4 className="font-bold mb-1">Hội Phục hồi sau Đột quỵ</h4>
            <p className="text-xs text-emerald-100">Chia sẻ kinh nghiệm & động viên nhau</p>
          </div>
        </div>
      </div>
    </div>
  );
}
