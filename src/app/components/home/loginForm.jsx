'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if ("Notification" in window && navigator.serviceWorker) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("🔔 اجازه نوتیفیکیشن داده شد!");
          } else {
            console.log("❌ اجازه نوتیفیکیشن رد شد!");
          }
        });
      }

      navigator.serviceWorker.register("/service-worker.js")
        .then((reg) => console.log("Service Worker Registered!", reg))
        .catch((err) => console.error("Service Worker Registration Failed!", err));
    }
  }, []);

  const handleSubmit = () => {
    if (!email || !password) {
      setError('ایمیل و رمز عبور را وارد کنید');
      return;
    }
    setError('');

    // ادامه فرایند لاگین
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 bg-white shadow-lg rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">ورود به حساب</h2>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                placeholder="ایمیل"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="password"
                placeholder="رمز عبور"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition"
              onClick={() => router.push('/dashboard')}
            >
              ورود
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}