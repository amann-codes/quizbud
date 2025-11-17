import { Topic, Difficulty, TimeLimit, QuesitonsLimit } from "./types";

export const TOPICS: { label: string; value: Topic }[] = [
    { label: "Aptitude", value: "aptitude" },
    { label: "Logical Reasoning", value: "logical-reasoning" },
    { label: "Technical Questions", value: "technical-questions" },
    { label: "Verbal", value: "verbal" },
    { label: "Quants", value: "quants" },
]

export const DIFFICULTIES: { label: string; value: Difficulty }[] = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
]

export const TIME_LIMITS: { label: string; value: TimeLimit }[] = [
    { label: "15 min", value: "15m" },
    { label: "30 min", value: "30m" },
    { label: "45 min", value: "45m" },
    { label: "60 min", value: "60m" },
]

export const QUESTION_COUNTS: { label: string; value: QuesitonsLimit }[] = [
    { label: "10 questions", value: "10q" },
    { label: "15 questions", value: "15q" },
    { label: "30 questions", value: "30q" },
]
