import React from 'react';
import { 
  User, 
  FileText, 
  History, 
  Lock, 
  ShieldCheck,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const records = [
    { id: '1', title: 'Kết quả xét nghiệm máu', date: '15/03/2026', hospital: 'BV Bạch Mai' },
    { id: '2', title: 'Đơn thuốc phục hồi chức năng', date: '10/03/2026', hospital: 'HomeCare Plus' },
    { id: '3', title: 'Phim chụp X-Quang phổi', date: '01/03/2026', hospital: 'BV Việt Đức' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ Sức khỏe điện tử (PHR)</h1>
        <p className="text-gray-500">Dữ liệu y tế của bạn được bảo mật và mã hóa đầu cuối.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-brand-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-blue font-bold text-3xl">
              YD
            </div>
            <h2 className="text-xl font-bold">Yen Dan</h2>
            <p className="text-gray-400 text-sm">ID: HC-998234</p>
            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-around">
              <div>
                <p className="text-xs text-gray-400">Nhóm máu</p>
                <p className="font-bold">O+</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Chiều cao</p>
                <p className="font-bold">170cm</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Cân nặng</p>
                <p className="font-bold">65kg</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-green/10 p-4 rounded-2xl border border-brand-green/20 flex items-center gap-3">
            <ShieldCheck className="text-brand-green" />
            <p className="text-xs text-brand-green font-medium">Dữ liệu đã được xác thực bởi Bộ Y tế</p>
          </div>
        </div>

        {/* Records */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FileText className="text-brand-blue" />
              Lịch sử bệnh án & Xét nghiệm
            </h3>
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                      <History size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{record.title}</h4>
                      <p className="text-xs text-gray-400">{record.hospital} • {record.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-brand-blue">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-brand-blue">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium hover:border-brand-blue hover:text-brand-blue transition-all">
              + Tải lên tài liệu mới
            </button>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h4 className="font-bold">Quyền riêng tư</h4>
                <p className="text-xs text-gray-400">Quản lý ai có thể xem hồ sơ của bạn</p>
              </div>
            </div>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold">
              Thiết lập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
