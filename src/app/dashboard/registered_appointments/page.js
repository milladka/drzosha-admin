"use client"
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import moment from 'moment-jalaali';
moment.locale('fa');
moment.loadPersian({ dialect: 'persian' });

export default function ManageAppointmentsPage() {
    const fetchedRef = useRef(false);
    const [data, setData] = useState({
        loading: true,
        appointments: []
    });

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        AxiosInstance.get('/admin/get_appointments_doctors')
            .then((res) => {
                setData({
                    appointments: res.data.data,
                    loading: false,
                })
            });

    }, []);

    let formattedTime = (time) => time ? time.split(":").slice(0, 2).join(":") : '';
    let shamsiDate = (miladiDate) => miladiDate ? moment(miladiDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : '';


    return (
        <>
            <div className="overflow-x-auto p-4">
                {data.loading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            className="w-10 h-10 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </div>
                ) : (
                    <>
                        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-slate-500">
                            <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="py-3 px-6 text-center">کد نوبت</th>
                                    <th className="py-3 px-6 text-center">کد پزشک</th>
                                    <th className="py-3 px-6 text-center">نام پزشک</th>
                                    <th className="py-3 px-6 text-center">تاریخ</th>
                                    <th className="py-3 px-6 text-center">ساعت شروع</th>
                                    <th className="py-3 px-6 text-center">ساعت پایان</th>
                                    <th className="py-3 px-6 text-center">مدت هر نوبت</th>
                                    <th className="py-3 px-6 text-center">وضعیت</th>
                                    <th className="py-3 px-6 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {(() => {
                                    return data.appointments.length > 0 ? (
                                        data.appointments.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-100">
                                                <td className="py-3 px-6 text-center">{item.id}</td>
                                                <td className="py-3 px-6 text-center">{item.doctor_id}</td>
                                                <td className="py-3 px-6 text-center">{item.first_name} {item.last_name}</td>
                                                <td className="py-3 px-6 text-center">{shamsiDate(item.appointment_date)}</td>
                                                <td className="py-3 px-6 text-center">{formattedTime(item.start_time)}</td>
                                                <td className="py-3 px-6 text-center">{formattedTime(item.end_time)}</td>
                                                <td className="py-3 px-6 text-center">{item.duration}</td>
                                                <td className="py-3 px-6 text-center">{item.is_past == 1 ? <span className="text-xs text-red-400">گذشته</span> : <span className="text-xs text-green-600">فعال</span>}</td>
                                                <td className="py-3 px-6 text-center">
                                                    {item.is_past === 0 && (
                                                        <button className="text-xs border text-red-700 border-red-700 hover:bg-red-700 transition-all duration-200 rounded px-2 py-1 hover:text-white">
                                                            حذف
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">
                                                هیچ نوبتی یافت نشد
                                            </td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </>
    );
}