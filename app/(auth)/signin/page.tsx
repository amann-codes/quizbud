import Signin from "@/components/pages/auth/Signin";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Signin | Quiz-bud",
    description: "Signin to test your aptitude"
}

export default function page() {
    return <Suspense fallback={<Loader2 className="animate-spin m-auto h-screen" />} >
        <Signin />
    </Suspense>
}