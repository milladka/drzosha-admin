"use client"
import { motion } from "framer-motion";

export default function Dashboard() {
    return (
        <div className="overflow-x-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>خوش آمدید</div>
            </motion.div>
        </div>
    );
}
