import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Heart, 
  Wind, 
  Activity, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight,
  Video,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { Vitals } from '../types';
import { cn } from '../lib/utils';

const VitalCard = ({ title, value, unit, icon: Icon, color, trend, history }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="vital-card"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="text-white" size={24} />
      </div>
      <div className={cn("flex items-center gap-1 text-sm font-medium", trend > 0 ? "text-green-500" : "text-red-500")}>
        {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        <span className="text-gray-400 font-medium">{unit}</span>
      </div>
    </div>
    <div className="h-16 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color.split(' ')[0].replace('bg-', '#')} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color.split(' ')[0].replace('bg-', '#')} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color.split(' ')[0].replace('bg-', '#')} 
            fillOpacity={1} 
            fill={`url(#gradient-${title})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const socket = io();

    socket.on('vitals_update', (data: Vitals) => {
      setVitals(data);
      setHistory(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString(), value: data.heartRate }].slice(-20);
        return newHistory;
      });
    });

    socket.on('emergency_alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chào buổi sáng, Dan!</h1>
          <p className="text-gray-500">Hệ thống đang giám sát sức khỏe của bạn ổn định.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Video size={20} />
            <span>Tư vấn 24/7</span>
          </button>
          <button className="btn-primary">
            <CalendarPlus size={20} />
            <span>Đặt lịch</span>
          </button>
        </div>
      </header>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="bg-red-500 p-2 rounded-full text-white animate-pulse">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-semibold">{alerts[0].message}</p>
              <p className="text-red-600 text-sm">Đã thông báo cho bác sĩ và người thân.</p>
            </div>
            <button 
              onClick={() => setAlerts([])}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <VitalCard 
          title="Nhịp tim" 
          value={vitals?.heartRate || '--'} 
          unit="BPM" 
          icon={Heart} 
          color="bg-red-500" 
          trend={2.4}
          history={history}
        />
        <VitalCard 
          title="SpO2" 
          value={vitals?.spo2 || '--'} 
          unit="%" 
          icon={Wind} 
          color="bg-brand-blue" 
          trend={-0.5}
          history={history.map(h => ({ ...h, value: 98 + Math.random() }))}
        />
        <VitalCard 
          title="Huyết áp" 
          value={vitals ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}` : '--'} 
          unit="mmHg" 
          icon={Activity} 
          color="bg-orange-500" 
          trend={1.2}
          history={history.map(h => ({ ...h, value: 120 + Math.random() * 10 }))}
        />
        <VitalCard 
          title="Đường huyết" 
          value={vitals?.glucose || '--'} 
          unit="mg/dL" 
          icon={Droplets} 
          color="bg-brand-green" 
          trend={-3.1}
          history={history.map(h => ({ ...h, value: 90 + Math.random() * 20 }))}
        />
      </div>

      {/* ECG Live View */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-brand-blue" />
            Điện tâm đồ (ECG) Thời gian thực
          </h3>
          <span className="flex items-center gap-2 text-brand-green text-sm font-bold">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-ping" />
            LIVE
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" hide />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0052CC" 
                strokeWidth={3} 
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
