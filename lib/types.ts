import { TestStatus } from "@prisma/client";
import z from "zod";

export type Topic = "aptitude" | "logical-reasoning" | "technical-questions" | "verbal" | "quants"

export type Difficulty = "easy" | "medium" | "hard"

export type TimeLimit = "15m" | "30m" | "45m" | "60m"

export type QuesitonsLimit = "10q" | "15q" | "30q"

export type UserCreatedQuiz = {
    id: string;
    name: string;
    createdAt: Date;
    _count: {
        questions: number;
        tests: number;
    };
};


export type Option = {
    id: string
    option: string
    correct: boolean
    userSelected: boolean | null
}

export type Question = {
    id: string
    question: string
    skip: boolean
    options: Option[]
    explanation: string | null
}

export type QuestionInstaceInTest = {
    id: string
    question: string
    options: Option[]
    skip: boolean;
    userSelection: boolean
    selectedAt: Date
    explanation: string
}

export type Quiz = {
    id: string
    name: string
    timeLimit: number
    creator: {
        id: string
        name: string | null
    }
    questions: Question[]
}

export type QuizInstanceInTest = {
    id: string
    name: string;
    timeLimit: number;
    creator: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        password: string;
    };
}

export type Test = {
    id: string;
    currentIndex: number;
    testStatus: TestStatus;
    startedAt: Date;
    quiz: {
        name: string,
        timeLimit: number
    };
    endedAt: Date | null;
    questions: Question[];
}

export type SelectedAnswers = Record<string, string>
export type TimePerQuestion = Record<string, number>

export type Attempt = {
    id: string
    quizId: string
    quizName: string
    score: number
    totalQuestions: number
    timeSpent: number // seconds
    startedAt: number // ms
    finishedAt: number // ms
    answers: Record<string, string>
    timePerQuestion: Record<string, number>
}

export type quizBody = {
    name: string
    questions: Question[]
    _count: {
        questions: number,
        tests: number
    }
}

export const EventSchema = z.object({
    eventType: z.enum(["SELECT", "SKIP", "SUBMIT", "NAVIGATE", "TIMEOUT", "HARDRESET", "RESET"]),
    questionId: z.string().optional(),
    optionId: z.string().optional(),
    questionIndex: z.number().int().min(0),
    idempotencyKey: z.string(),
    clientTimestamp: z.coerce.date(),
});

export type EventPayload = z.infer<typeof EventSchema>

export interface GenerateQuizParams {
    topics: Topic[]; // Changed from topic: Topic
    difficulty: Difficulty;
    questionCount: QuesitonsLimit | number; // Now allows a custom number
    timeLimit: TimeLimit; // Added timeLimit
}

export interface QuizQuestionOption {
    id: string;
    option: string;
    correct: boolean;
}

export interface GetQuizActionResult {
    id: string;
    name: string;
    expect: string;
    timeLimit: number;
    creator: { name: string };
    questions: { id: string }[];
}