"use client"

import AxiosInstance from "@/app/config/axiosInstance";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import DynamicSelect from "@/app/utils/dynamicSelect";
import { LoadingButton } from "@/app/utils/loadingButton";
import { addNotification } from "@/app/store/notificationStore";
import { useRouter } from 'next/navigation'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Italic,
    List,
    Paragraph,
    Underline
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ar.js';
import 'ckeditor5/ckeditor5.css';

export default function NewCenterPage() {
    const router = useRouter();
    const [data, setData] = useState({
        firstLoading: true,
        name: '',
        address: '',
        phone: '',
        description: '',
        image_id: '',
        slug: '',
        city_id: '',
        centerOptions: [{ label: 'عمومی', value: 'public' }, { label: 'خصوصی', value: 'private' }],
        cityOptions: [],
        specialtiesOptions: [],
        categoriesOptions: [
            {
                id: 6,
                name: 'کلینیک'
            },
            {
                id: 7,
                name: 'بیمارستان'
            },
            {
                id: 8,
                name: 'داروخانه'
            },
            {
                id: 9,
                name: 'آزمایشگاه'
            },
            {
                id: 10,
                name: 'مرکز تصویربرداری'
            }
        ],
        center: '',
        latitude: '',
        longitude: '',
        category_id: null,
        image: '',
        submitLoading: false
    });
    const [errors, setErrors] = useState({});

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    useEffect(() => {
        let isSubscribed = true;
        const fetchCities = async () => {
            await AxiosInstance.get('/utility/cities')
                .then(res => {
                    if (!res.data.error) {
                        setData((prev) => ({ ...prev, cityOptions: res.data.data }));
                    }
                })
            await sleep(500);
        }
        const fetchSpecialties = async () => {
            await AxiosInstance.get('/utility/get_specialties_show')
                .then(res => {
                    if (!res.data.error) {
                        setData((prev) => ({ ...prev, specialtiesOptions: res.data.data }));
                    }
                })
            await sleep(500);
            setData((prev) => ({ ...prev, firstLoading: false }));
        }
        if (isSubscribed) {
            fetchCities();
            fetchSpecialties();
        }
        return () => isSubscribed = false;
    }, [])

    if (data.firstLoading) {
        return (<div className="overflow-x-auto p-4">
            <div className="flex justify-center items-center h-64">
                <motion.div
                    className="w-10 h-10 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            </div>
        </div>)
    }

    const validateField = (name, value) => {
        let error = "";
        if (!value) {
            error = "این فیلد نمی‌تواند خالی باشد";
        } else {
            if (name == 'slug') {
                var english = /^[A-Za-z0-9_]*$/;
                if (!english.test(value)) {
                    error = "فرمت نامک صحیح نیست، فقط متن انگلیسی مجاز است";
                } else {
                    error = "";
                }
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSelectChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, ['image']: file }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'slug') {
            let oldValue = value.replace(" ", "_");
            setData(prev => ({ ...prev, [name]: oldValue }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
        validateField(name, value);
    };

    const validateForm = () => {
        let errors = {};
        if (!data.name) errors.name = "نام الزامی است";
        if (!data.slug) errors.slug = "نامک الزامی است";
        if (!data.category_id) errors.category_id = "دسته بندی الزامی است";
        if (!data.city_id) errors.city_id = "شهر الزامی است";
        if (!data.phone) errors.phone = "تلفن الزامی است";
        if (!data.address) errors.address = "آدرس الزامی است";
        if (!data.description) errors.description = "توضیحات الزامی است";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async () => {
        if (!validateForm()) return;
        setData(prev => ({ ...prev, submitLoading: true }));
        if (!data.image_id && data.image) {
            await AxiosInstance.postForm('/utility/upload_profile',
                {
                    image: data.image
                }
            )
                .then(async res => {
                    if (!res.data.error) {

                        await AxiosInstance.postForm('/admin/insert_center',
                            {
                                name: data.name,
                                address: data.address,
                                phone: data.phone,
                                description: data.description,
                                image_id: res.data.id,
                                slug: data.slug,
                                city_id: data.city_id,
                                center: data.center,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                category_id: data.category_id
                            }
                        )
                            .then((res) => {
                                if (!res.data.error) {
                                    addNotification(res.data.message);
                                    router.push('/dashboard/center_management')
                                } else {
                                    addNotification(res.data.message, true)
                                }
                            })
                        setData(prev => ({ ...prev, submitLoading: false }));
                    }
                })
        } else {
            await AxiosInstance.postForm('/admin/insert_center',
                {
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    description: data.description,
                    image_id: data.image_id,
                    slug: data.slug,
                    city_id: data.city_id,
                    center: data.center,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    category_id: data.category_id
                }
            )
                .then((res) => {
                    if (!res.data.error) {
                        addNotification(res.data.message);
                        router.push('/dashboard/center_management')
                    } else {
                        addNotification(res.data.message, true)
                    }
                })
            setData(prev => ({ ...prev, submitLoading: false }));
        }
    }
    return (
        <>
            <div className="p-1 lg:p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid grid-cols-2 border-b border-slate-200 p-1 lg:p-2 mb-5 lg:mb-10">
                        <div className="font-bold text-sm lg:text-lg text-slate-800 items-center flex">ایجاد مرکز درمانی جدید</div>
                        <div className="flex items-center justify-end">
                            <Link className="px-2 py-1 rounded text-left flex items-center gap-2 text-xs lg:text-sm hover:bg-slate-100" href="/dashboard/center_management">
                                <div>بازگشت</div>
                                <ArrowLeft width={15} />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="name">نام مرکز</label>
                                <input value={data.name || ""} onChange={handleChange} name="name" id="name" className="outline-none text-sm border rounded w-full p-2 bg-white" />
                                {errors['name'] && <p className="text-red-500 text-[10px] p-1">{errors['name']}</p>}
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="slug">نامک</label>
                                <input id="slug" value={data.slug || ""} onChange={handleChange} name="slug" dir="ltr" className="text-left outline-none text-sm border rounded w-full p-2 bg-white" />
                                {errors['slug'] ? <p className="text-red-500 text-[10px] p-1">{errors['slug']}</p> : <span className="text-[10px] text-slate-400 block p-1">نامک بصورت انگلیسی وارد شود</span>}
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="category_id">دسته بندی مرکز</label>
                                <select name="category_id" defaultValue={data.category_id || ""} onChange={(e) => handleSelectChange("category_id", e.target.value)} className="outline-none border text-sm rounded w-full p-[6px] bg-white" id="category_id">
                                    <option value={''}>انتخاب کنید</option>
                                    {
                                        data.categoriesOptions.map((item) => {
                                            return (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                {errors['category_id'] && <p className="text-red-500 text-[10px] p-1">{errors['category_id']}</p>}
                            </div>
                        </div>

                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1">شهر مرکز</label>
                                <DynamicSelect selectedOption={data.city_id || ""} options={data.cityOptions} onSelect={(value) => handleSelectChange("city_id", value)} label={'شهر پزشک را انتخاب کنید'} />
                                {errors['city_id'] && <p className="text-red-500 text-[10px] p-1">{errors['city_id']}</p>}
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="phone">تلفن مرکز</label>
                                <input onChange={handleChange} value={data.phone || ""} name="phone" id="phone" className="outline-none text-sm border rounded w-full p-2 bg-white" />
                                {errors['phone'] && <p className="text-red-500 text-[10px] p-1">{errors['phone']}</p>}

                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="address">آدرس مرکز</label>
                                <input onChange={handleChange} value={data.address || ""} name="address" id="address" className="outline-none text-sm border rounded w-full p-2 bg-white" />
                                {errors['address'] ? <p className="text-red-500 text-[10px] p-1">{errors['address']}</p> : <span className="text-[10px] text-slate-400 block p-1">بدون نام شهر وارد کنید</span>}
                            </div>
                        </div>
                        <div className="col-span-1 lg:col-span-3">
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="description">توضیحات</label>
                                <CKEditor

                                    editor={ClassicEditor}
                                    onChange={(e, d) => handleSelectChange("description", d.getData())}
                                    config={{
                                        height: 400,
                                        language: 'ar',
                                        translations: [translations],
                                        contentsLangDirection: 'rtl',
                                        licenseKey: 'GPL',
                                        plugins: [Essentials, Paragraph, Bold, Italic, BlockQuote,
                                            Heading,
                                            List,
                                            Underline],
                                        toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'blockquote', 'heading', 'list'],
                                        heading: {
                                            options: [
                                                {
                                                    model: 'paragraph',
                                                    title: 'پاراگراف',
                                                    class: 'ck-heading_paragraph'
                                                },
                                                {
                                                    model: 'heading2',
                                                    view: 'h2',
                                                    title: 'Heading 2',
                                                    class: 'font-bold'
                                                }
                                            ]
                                        },
                                        initialData: data.description || "",
                                    }}
                                />
                                {errors['description'] && <p className="text-red-500 text-[10px] p-1">{errors['description']}</p>}
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="latitude">طول جغرافیایی</label>
                                <input id="latitude" onChange={handleChange} value={data.latitude || ""} name="latitude" className="outline-none text-sm border rounded w-full p-2 bg-white" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="longitude">عرض جغرافیایی</label>
                                <input id="longitude" onChange={handleChange} value={data.longitude || ""} name="longitude" className="outline-none text-sm border rounded w-full p-2 bg-white" />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1" htmlFor="center">نوع مرکز</label>
                                <select defaultValue={data.center || ""} onChange={(e) => handleSelectChange("center", e.target.value)} className="outline-none border text-sm rounded w-full p-[6px] bg-white" id="center">
                                    <option value={''}>انتخاب کنید</option>
                                    {
                                        data.centerOptions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.value}>{item.label}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="mb-2 block text-sm pr-1">تصویر پروفایل مرکز</label>
                                <label className="outline-none text-sm rounded w-full p-2 bg-white overflow-hidden border cursor-pointer flex">
                                    <div className="bg-white flex items-center gap-2 text-sm pr-1">
                                        <UploadCloud />
                                        انتخاب و بارگذاری
                                    </div>

                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                {data.image && <><img src={URL.createObjectURL(data.image)} alt="Doctor Profile" className="mt-2 w-24 h-24 rounded object-cover" /><button onClick={() => setData(prev => ({ ...prev, ['image']: '' }))} className="text-xs text-red-800">حذف</button></>}

                            </div>
                        </div>
                        <div></div>
                        <div className="flex items-end">
                            <button disabled={data.submitLoading} onClick={submitForm} className="flex items-center justify-center w-full text-center border rounded-md p-2 text-white text-sm bg-violet-800 hover:bg-violet-900">
                                {
                                    data.submitLoading ?
                                        <LoadingButton />
                                        :
                                        <span>ثبت مرکز جدید</span>
                                }
                            </button>
                        </div>
                    </div>
                </motion.div >
            </div >
        </>
    );

}