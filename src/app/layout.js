import NotificationPanel from "./components/NotificationPanel";
import "./globals.css";
import { localFont } from 'next/font/local';

const iransans = localFont({
  src: [
    {
      path: '../../public/fonts/ttf/IRANSansWeb(FaNum).ttf',
      weight: 'normal'
    },
    {
      path: '../../public/fonts/ttf/IRANSansWeb(FaNum)_Medium.ttf',
      weight: '500'
    },
    {
      path: '../../public/fonts/ttf/IRANSansWeb(FaNum)_Light.ttf',
      weight: '300'
    },
    {
      path: '../../public/fonts/ttf/IRANSansWeb(FaNum)_UltraLight.ttf',
      weight: '200'
    },
    {
      path: '../../public/fonts/ttf/IRANSansWeb(FaNum)_Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-iransans'
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body className={`${iransans.className} font-sans`}>
        <main className='bg-[#f4faff] flex flex-col min-h-screen'>
          <div className='flex-grow'>
            {children}
            {<NotificationPanel />}
          </div>
        </main>
      </body>
    </html>
  );
}