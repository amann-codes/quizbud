import { Header } from "@/components/pages/layout/header"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-dvh">
            <Header />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}