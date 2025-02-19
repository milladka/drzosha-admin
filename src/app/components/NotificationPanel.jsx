"use client"
import { motion, AnimatePresence } from "framer-motion";
import { X, CircleCheckBig, TriangleAlert } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";

export default function NotificationPanel() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-5 left-5 space-y-2 z-[100]">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`border-r-4 ${notif.error ? 'border-red-500' : 'border-green-500'} bg-white shadow-lg rounded-lg p-4 flex items-center justify-between w-72`}
          >
            {
              notif.error ? <TriangleAlert className="text-red-500 w-5 h-5" /> : <CircleCheckBig className="text-green-500 w-5 h-5" />
            }
            <span className="p-2 text-sm text-slate-700 text-right">{notif.message}</span>
            <button onClick={() => removeNotification(notif.id)}>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}