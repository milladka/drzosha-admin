"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AxiosInstance from "@/app/config/axiosInstance";
export default function CenterManagementPage() {

    const [data, setData] = useState({
        loading: true,
        centers: []
    });

    useEffect(() => {
        AxiosInstance.get('/admin/get_centers')
            .then((res) => {
                setData({ centers: res.data.data, loading: false });
            })
    }, []);

    return (
        <>
            <div className="overflow-x-auto p-1 lg:p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid grid-cols-2 border-b border-slate-200 p-1 lg:p-2 mb-5 lg:mb-10">
                        <div className="font-bold text-sm lg:text-lg text-slate-800 items-center flex">مراکز درمانی</div>
                        <div className="flex items-center justify-end">
                            <Link className="bg-violet-100 px-2 py-1 rounded text-left flex items-center gap-2 text-xs lg:text-sm hover:bg-slate-100" href="/dashboard/center_management/new">
                                <Plus width={15} />
                                <div>مرکز درمانی جدید</div>
                            </Link>
                        </div>
                    </div>
                    <div>
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
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">شناسه</th>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">نام</th>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">لینک</th>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">دسته بندی</th>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">شهر</th>
                                        <th className="text-xs xl:text-sm py-3 px-6 text-center">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {data.centers.length > 0 ? (
                                        data.centers.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-100">
                                                <td className="py-3 px-6 text-center">{item.id}</td>
                                                <td className="py-3 px-6 text-center">
                                                    {item.name}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <a className="text-blue-500" target="_blank" href={`https://drzosha.com/center/${item.slug}`}>لینک</a>
                                                </td>
                                                <td className="py-3 px-6 text-center">{item.category}</td>
                                                <td className="py-3 px-6 text-center">{item.city}</td>
                                                <td className="py-3 px-6 text-center"><Link href={`/dashboard/center_management/edit/${item.id}`}>ویرایش</Link></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-gray-500">
                                                هیچ مرکزی یافت نشد
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    )
}