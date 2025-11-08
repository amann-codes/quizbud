import Signup from "@/components/pages/auth/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Signup | Quiz-bud",
    description: "Sigup to test your aptitude"
}

export default function page() {
    return <Signup />;
}