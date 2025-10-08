import SideNav from "@/components/custom/SideNav"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <div className="w-full flex-none lg:w-64 z-50">
                <SideNav />
            </div>
            <div className="flex-grow p-6 lg:mt-4 mt-8 lg:overflow-y-auto lg:p-12">{children}</div>
        </div>
    );
}