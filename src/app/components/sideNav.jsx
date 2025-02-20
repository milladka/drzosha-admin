"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Users, Menu, X, Ribbon, Stethoscope, Hospital } from "lucide-react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }

    const menuItems = [
        { name: "داشبورد", icon: <Home size={18} />, link: "/dashboard" },
        { name: "کاربران", icon: <Users size={18} />, link: "/dashboard/users" },
        { name: "درخواست پزشکان", icon: <Ribbon size={18} />, link: "/dashboard/request_doctors" },
        { name: "پزشک‌های فعال", icon: <Stethoscope size={18} />, link: "/dashboard/active_doctors" },
        { name: "مراکز درمانی", icon: <Hospital size={18} />, link: "/dashboard/center_management" }
    ];

    return (
        <div className="flex">
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 w-full h-0.5 bg-violet-300 z-50"
                >
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-violet-500"
                    ></motion.div>
                </motion.div>
            )}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 0.5 : 0 }}
                transition={{ duration: 0.3, delay: isOpen ? 0.2 : 0 }}
                className={`z-20 fixed inset-0 bg-slate-500 md:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                onClick={toggleSidebar}
            ></motion.div>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: 208 }}
                animate={{ x: isOpen ? 0 : 208 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 text-white h-screen w-52 fixed right-0 md:relative md:translate-x-0 z-30"
            >
                <div className="p-4 flex justify-between items-center">
                    <span className="text-md lg:text-lg font-bold">پنل مدیریت</span>
                    <X className="cursor-pointer md:hidden" onClick={toggleSidebar} />
                </div>
                <ul className="p-4">
                    {menuItems.map((item, index) => (
                        <Link
                            onClick={() => handleClose()}
                            key={index}
                            href={item.link}
                            className={`transition-all mb-1 flex items-center gap-2 p-2 rounded-md cursor-pointer 
                                ${pathname === item.link ? "bg-slate-800" : "hover:bg-gray-700"}`}
                        >
                            {item.icon}
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    ))}
                </ul>
            </motion.aside>

            {/* Menu Button for Mobile */}
            <div className="min-h-12 p-2 bg-white border shadow w-full fixed md:hidden z-10">
                <div className="flex justify-start items-center">
                    <button
                        className="p-2 text-gray-800 rounded-md"
                        onClick={toggleSidebar}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="text-lg flex items-center gap-2 font-bold">
                        <Image src="/logo.png" alt="دکتر زوشا" width={30} height={30} />
                        <div>پنل مدیریت</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Sidebar;