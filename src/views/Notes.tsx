import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Calendar as CalendarIcon,
  Search,
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../types';
import { cn } from '../lib/utils';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;

    const noteData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    if (editingNote) {
      await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
    }

    setFormData({ title: '', content: '', tags: '', date: new Date().toISOString().split('T')[0] });
    setIsAdding(false);
    setEditingNote(null);
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      date: note.date
    });
    setIsAdding(true);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhật ký Sức khỏe</h1>
          <p className="text-gray-500">Ghi lại các triệu chứng, cảm nhận và lưu ý quan trọng hàng ngày.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingNote(null);
            setFormData({ title: '', content: '', tags: '', date: new Date().toISOString().split('T')[0] });
          }}
          className="btn-primary"
        >
          <Plus size={20} />
          <span>Tạo ghi chú</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc thẻ..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div 
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <CalendarIcon size={14} />
                  {new Date(note.date).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => startEdit(note)} className="p-2 text-gray-400 hover:text-brand-blue">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-4">
                {note.content}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-50">
                {note.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-brand-blue/5 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-lg">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingNote ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ví dụ: Triệu chứng đau đầu nhẹ..."
                    className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ngày ghi nhận</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung</label>
                  <textarea 
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Mô tả chi tiết cảm nhận của bạn..."
                    className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thẻ (phân cách bằng dấu phẩy)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Triệu chứng, Thuốc, Cảm nhận..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 btn-primary py-4"
                  >
                    <Save size={20} />
                    <span>{editingNote ? 'Cập nhật' : 'Lưu ghi chú'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
