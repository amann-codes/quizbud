import Signup from "@/components/pages/auth/Signup";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Signup | Quiz-bud",
    description: "Sigup to test your aptitude"
}

export default function page() {
    return <Suspense fallback={<Loader2 className="animate-spin m-auto h-screen" />} >
        <Signup />
    </Suspense>

}