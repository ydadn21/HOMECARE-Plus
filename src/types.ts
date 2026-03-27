export interface Vitals {
  heartRate: number;
  spo2: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  glucose: string;
  timestamp: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  pricing: {
    level: string;
    price: string;
    duration: string;
  }[];
  category: string;
}

export interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'exercise';
  title: string;
  time: string;
  completed: boolean;
  voicePrompt?: string;
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  isExpert?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  createdAt: string;
}
