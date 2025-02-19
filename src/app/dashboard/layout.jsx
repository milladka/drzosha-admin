import SideNav from "../components/sideNav";

export default function Layout({ children }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-50">
            <div className="w-full flex-none md:w-52">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-8 mt-14 lg:mt-0">{children}</div>
        </div>
    );
}