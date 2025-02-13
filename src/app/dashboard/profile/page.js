"use client"
import { addNotification } from "@/app/store/notificationStore"

export default function Profile() {

    return (
        <div>
            Profile
            <button onClick={() => addNotification('ویرایش کاربر با موفقیت انجام شد', true)}>ij</button>
        </div>
    )
}