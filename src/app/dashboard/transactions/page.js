"use client"
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import moment from 'moment-jalaali';
moment.locale('fa');
moment.loadPersian({ dialect: 'persian' });

export default function LastAppointmentsPage() {
    const fetchedRef = useRef(false);
    const [data, setData] = useState({
        loading: false,
        appointments: []
    });


    let formattedTime = (time) => time ? time.split(":").slice(0, 2).join(":") : '';
    let shamsiDate = (miladiDate) => miladiDate ? moment(miladiDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : '';


    return (
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
                <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-slate-500">
                    <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="py-3 px-6 text-center">کد تراکنش</th>
                            <th className="py-3 px-6 text-center">زمان تراکنش</th>
                            <th className="py-3 px-6 text-center">مبلغ تراکنش</th>
                            <th className="py-3 px-6 text-center">بابت</th>
                            <th className="py-3 px-6 text-center">طرف تراکنش</th>
                            <th className="py-3 px-6 text-center">وضعیت تراکنش</th>
                            <th className="py-3 px-6 text-center">کد پیگیری</th>
                            <th className="py-3 px-6 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {
                            data.appointments && data.appointments.length > 0 ?
                                (
                                    data.appointments.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-3 px-6 text-center">{item.reserveId}</td>
                                            <td className="py-3 px-6 text-center">{item.firstname} {item.lastname}</td>
                                            <td className="py-3 px-6 text-center">{item.national_code}</td>
                                            <td className="py-3 px-6 text-center">{item.phone}</td>
                                            <td className="py-3 px-6 text-center">{shamsiDate(item.appointment_date)} - {formattedTime(item.reservation_time)}</td>
                                            <td className="py-3 px-6 text-center">{item.is_past == 1 ? <span className="text-xs text-red-400">گذشته</span> : <span className="text-xs text-green-600">فعال</span>}</td>
                                        </tr>
                                    ))
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan="8" className="py-4 text-center text-gray-500">
                                            هیچ تراکنشی یافت نشد
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            )}
        </div>
    );
}