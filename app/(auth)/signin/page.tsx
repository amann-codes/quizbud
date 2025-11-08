import Signin from "@/components/pages/auth/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Signin | Quiz-bud",
    description: "Signin to test your aptitude"
}

export default function page() {
    return <Signin />;
}