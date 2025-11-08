"use server"

import { getSession } from "@/actions/getSession"

export async function generateQuiz() {
    await getSession();
    return {
        name: "JavaScript Fundamentals",
        questions: [
            {
                id: "q_js_1",
                question: "What is the result of `typeof null` in JavaScript?",
                options: [
                    { id: "q1_opt1", option: "'null'", correct: false },
                    { id: "q1_opt2", option: "'undefined'", correct: false },
                    { id: "q1_opt3", option: "'object'", correct: true },
                    { id: "q1_opt4", option: "'string'", correct: false },
                ],
                explanation: "This is a long-standing bug in JavaScript. The specification states that `null` is a primitive value, but `typeof null` incorrectly returns 'object'."
            },
            {
                id: "q_js_2",
                question: "Which of the following is NOT a primitive type in JavaScript?",
                options: [
                    { id: "q2_opt1", option: "String", correct: false },
                    { id: "q2_opt2", option: "Number", correct: false },
                    { id: "q2_opt3", option: "Symbol", correct: false },
                    { id: "q2_opt4", option: "Array", correct: true },
                ],
                explanation: "Arrays are objects in JavaScript, not primitive types. The primitive types are String, Number, BigInt, Boolean, Undefined, Symbol, and Null."
            },
            {
                id: "q_js_3",
                question: "What does the `===` operator do?",
                options: [
                    { id: "q3_opt1", option: "Checks for equality with type coercion.", correct: false },
                    { id: "q3_opt2", option: "Assigns a value to a variable.", correct: false },
                    { id: "q3_opt3", option: "Checks for strict equality without type coercion.", correct: true },
                    { id: "q3_opt4", option: "Compares two object references.", correct: false },
                ],
                explanation: "The triple equals `===` is the strict equality operator. It checks if two values are of the same type and have the same value, without converting types."
            },
        ],
        _count: {
            questions: 3,
            tests: 48,
        }
    }
}