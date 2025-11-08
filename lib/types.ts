export type Topic = "aptitude" | "logical-reasoning" | "technical-questions" | "verbal" | "quants"

export type Difficulty = "easy" | "medium" | "hard"

export type TimeLimit = "no-limit" | "15m" | "30m" | "45m" | "60m"

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
}

export type Question = {
    id: string
    question: string
    options: Option[]
    explanation: string
}

export type TestInstanceQuestion = {
    id: string
    question: string
    options: Option[]
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
    name: string;
    timeLimit: number;
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