"use server"

import { TestCard } from "@/components/pages/test/testcard";

export default async function page({ params }: { params: { test_id: string } }) {
    const { test_id } = await params;
    return <TestCard id={test_id} />;
}