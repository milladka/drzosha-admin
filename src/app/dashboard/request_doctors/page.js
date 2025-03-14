"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import { FolderCheck, ShieldCheck } from "lucide-react";
import ConvertDate from "@/app/components/convertDate";
import Modal from "@/app/components/modal";
import { CompleteData } from "@/app/components/requestDoctors/completeData";
import { OpenModal } from "@/app/store/modalStore";
import { addNotification } from "@/app/store/notificationStore";

export default function RequestDoctorsPage() {
    const [data, setData] = useState({
        loading: true,
        users: [],
        selected: ''
    });

    useEffect(() => {
        AxiosInstance.get('/admin/get_request_doctors')
            .then((res) => {
                setData({ users: res.data, loading: false });
            })
            .catch((err) => {
                console.error("Error fetching doctors:", err);
                setData({ users: [], loading: false });
            });
    }, []);

    const approveDoctor = (id) => {
        if (id) {
            AxiosInstance.postForm('/admin/approve_doctor', {
                id: id
            })
                .then(res => {
                    if (!res.data.error) {
                        addNotification(res.data.message)
                    }
                })
        }
    }

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
                    <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-slate-500">
                        <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">شناسه</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">نام و نام خانوادگی پزشک</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">کدملی</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">جنسیت</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">کد نظام پزشکی</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">موبایل</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">ایمیل</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">درخواست</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">تخصص</th>
                                <th className="text-xs xl:text-sm py-3 px-6 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {data.users.length > 0 ? (
                                data.users.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-6 text-center">{item.id}</td>
                                        <td className="py-3 px-6 text-center">
                                            {item.first_name} {item.last_name}
                                        </td>
                                        <td className="py-3 px-6 text-center">{item.national_code}</td>
                                        <td className="py-3 px-6 text-center">
                                            {item.gender === "male" ? "مرد" : "زن"}
                                        </td>
                                        <td className="py-3 px-6 text-center">{item.medical_code}</td>
                                        <td className="py-3 px-6 text-center">{item.mobile}</td>
                                        <td className="py-3 px-6 text-center">{item.email}</td>
                                        <td className="py-3 px-6 text-center">{<ConvertDate date={item.created_at} />}</td>
                                        <td className="py-3 px-6 text-right">
                                            {item.specialties.map((resp, index) => {
                                                return <div className="text-xs block mb-2" key={resp.id}>{index + 1}- {resp.name}</div>
                                            })}
                                        </td>
                                        <td className="py-3 px-6 text-center flex flex-row gap-2">
                                            <button onClick={() => { setData((prev) => ({ ...prev, selected: item.id })); OpenModal() }} className="transition-all p-2 text-xs border outline-none rounded flex items-center gap-2 shadow hover:bg-violet-400 hover:text-white">
                                                <FolderCheck size={14} />
                                                <span>تکمیل اطلاعات</span>
                                            </button>
                                            {
                                                item.status = 'pending' && (
                                                    <button onClick={() => approveDoctor(item.id)} className="transition-all p-2 text-xs outline-none rounded flex items-center gap-2 shadow hover:bg-green-500 hover:text-white">
                                                        <ShieldCheck size={14} />
                                                        <span>تایید پزشک</span>
                                                    </button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="py-4 text-center text-gray-500">
                                        هیچ پزشکی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div >
            <Modal title={'تکمیل اطلاعات پزشک'}>
                <CompleteData id={data.selected} />
            </Modal>
        </>
    );
}