"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaGoogle } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { loginSchema, registerSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import axios from "axios"
import { useRouter } from 'next/navigation';

type LoginFormProps = z.infer<typeof loginSchema>


interface LoginPageProps { }

const LoginPage: React.FC<LoginPageProps> = () => {
    const router = useRouter()
    const query = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: LoginFormProps) => {
            const res = await axios.post("/api/auth/login", data)
            return res.data
        },
        onSuccess(data, variables, context) {
            console.log("Login Successful");
            router.push("/")
        },
    })
    const form = useForm<LoginFormProps>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema)
    })

    const handleSubmit = async (data: LoginFormProps) => {
        await query.mutateAsync(data)
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Sign In to account</h2>
                <form {...form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter email"
                            {...form.register('email')}
                        />
                        {form.formState.errors.email && (
                            <p className='mt-1.5 text-red-600 text-xs'>{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Create password"
                            {...form.register('password')}
                        />
                        {form.formState.errors.password && (
                            <p className='mt-1.5 text-red-600 text-xs'>{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-500 mr-2">OR CONTINUE WITH</span>
                        <Button variant="outline" className="flex items-center justify-center">
                            <FaGoogle className="mr-2" />
                            Google
                        </Button>
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-gray-500">
                            Don&apos;t Have an account?{' '}
                            <Link href="/register" className="text-blue-500 hover:underline">
                                Click here to Register
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;