"use server"

import { ResultsView } from "@/components/pages/result/resultcard";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ResultsView testId={id} />;
}