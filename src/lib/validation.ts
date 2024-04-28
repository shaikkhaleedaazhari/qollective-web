import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string({
        required_error: "password is required"
    }).min(8, {
        message: "Password must be 8 characters long"
    }).max(255, {
        message: "Password must be less than 255 characters"
    })
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string({
        required_error: "password is required"
    }).min(8, {
        message: "Password must be 8 characters long"
    }).max(255, {
        message: "Password must be less than 255 characters"
    }),
    username: z.string().min(3, {
        message: "Username must be 3 characters long"
    }).max(255, {
        message: "Username must be less than 255 characters"
    }),
    confirmPassword: z.string({
        required_error: "password is required"
    }).min(8, {
        message: "Password must be 8 characters long"
    }).max(255, {
        message: "Password must be less than 255 characters"
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const questionBankSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be 3 characters long"
    }).max(255, {
        message: "Name must be less than 255 characters"
    }),
    description: z.string().min(3, {
        message: "Description must be 3 characters long"
    }).max(255, {
        message: "Description must be less than 255 characters"
    }),
    subject: z.string().min(3, {
        message: "Subject must be 3 characters long"
    }).max(255, {
        message: "Subject must be less than 255 characters"
    })
})

export const questionSchema = z.object({
    question: z.string().min(3, {
        message: "Question must be 3 characters long"
    }).max(255, {
        message: "Question must be less than 255 characters"
    }),
    options: z.array(z.object({
        option: z.string().min(3, {
            message: "Option must be 3 characters long"
        }).max(255, {
            message: "Option must be less than 255 characters"
        }),
        isCorrect: z.boolean()
    }))
})