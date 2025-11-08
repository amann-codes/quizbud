"use server"

import QuizCard from "@/components/pages/quiz/quizcard"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <QuizCard id={id} />;
}