import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  Star, 
  Users, 
  Baby, 
  HeartPulse,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';
import { cn } from '../lib/utils';

const LoyaltyCard = () => (
  <div className="bg-gradient-to-br from-brand-blue to-blue-700 rounded-3xl p-8 text-white shadow-xl mb-12 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">Chương trình thành viên</p>
          <h2 className="text-3xl font-bold">Hạng Gold Member</h2>
        </div>
        <Star className="text-yellow-400 fill-yellow-400" size={40} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-blue-100 text-xs mb-2">Điểm tích lũy</p>
          <p className="text-4xl font-black">2,450 <span className="text-lg font-normal">pts</span></p>
        </div>
        <div className="text-right">
          <p className="text-blue-100 text-xs mb-1">Ưu đãi hiện tại</p>
          <p className="text-xl font-bold">Giảm 10% dịch vụ</p>
        </div>
      </div>
      <div className="mt-8 h-2 bg-blue-900/30 rounded-full overflow-hidden">
        <div className="h-full bg-white w-3/4 rounded-full" />
      </div>
      <p className="mt-2 text-xs text-blue-100">Còn 550 điểm để lên hạng Platinum</p>
    </div>
    {/* Decorative circles */}
    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
    <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
  </div>
);

const ServiceCard = ({ service }: { service: Service }) => {
  const getIcon = (cat: string) => {
    switch(cat) {
      case 'HomeCare': return <Users className="text-brand-blue" />;
      case 'Rehab': return <HeartPulse className="text-brand-blue" />;
      case 'Maternity': return <Baby className="text-brand-blue" />;
      default: return <Users className="text-brand-blue" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full"
    >
      <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6">
        {getIcon(service.category)}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-500 mb-8 flex-1">{service.description}</p>
      
      <div className="space-y-4 mb-8">
        {service.pricing.map((p, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">{p.level}</p>
              <p className="font-bold text-gray-900">{p.price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Thời lượng</p>
              <p className="text-sm font-medium">{p.duration}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full btn-primary py-4">
        <span>Đặt lịch ngay</span>
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

export default function Pricing() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Danh mục Dịch vụ & Bảng giá</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Giải pháp chăm sóc sức khỏe toàn diện tại nhà với đội ngũ chuyên gia y tế hàng đầu.
        </p>
      </header>

      <LoyaltyCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* MDT Section */}
      <div className="bg-brand-green/5 border border-brand-green/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-white shrink-0">
          <Users size={40} />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nhóm Đa chuyên ngành (MDT)</h3>
          <p className="text-gray-600">
            Dành cho các ca bệnh phức tạp cần sự phối hợp giữa Bác sĩ, Điều dưỡng và Kỹ thuật viên. 
            Chúng tôi sẽ xây dựng phác đồ riêng biệt cho từng bệnh nhân.
          </p>
        </div>
        <button className="btn-secondary whitespace-nowrap">
          <span>Nhận báo giá riêng</span>
        </button>
      </div>

      {/* Compliance Note */}
      <div className="mt-12 flex items-start gap-3 p-4 bg-gray-100 rounded-2xl text-sm text-gray-500">
        <Info size={20} className="shrink-0 mt-0.5" />
        <p>
          Tất cả hoạt động tư vấn và chăm sóc từ xa tuân thủ nghiêm ngặt Thông tư 49/2017/TT-BYT của Bộ Y tế về hoạt động y tế từ xa. 
          Giá dịch vụ đã bao gồm bảo hiểm trách nhiệm nghề nghiệp.
        </p>
      </div>
    </div>
  );
}
