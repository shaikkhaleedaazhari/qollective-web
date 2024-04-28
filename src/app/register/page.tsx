"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaGoogle } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { registerSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from "axios"


type RegisterFormProps = z.infer<typeof registerSchema>

interface CreateAccountProps { }

const CreateAccount: React.FC<CreateAccountProps> = () => {
    const router = useRouter()
    const query = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: RegisterFormProps) => {
            const res = await axios.post("/api/auth/register", data)
            return res.data
        },
        onSuccess(data, variables, context) {
            console.log("Register Successful");
            router.push("/")
        },
    })
    const form = useForm<RegisterFormProps>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        resolver: zodResolver(registerSchema),
        disabled: query.isPending
    })

    const handleSubmit = async (data: RegisterFormProps) => {
        await query.mutateAsync(data);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Create an account</h2>
                <form {...form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Enter user name"
                            {...form.register('username')}
                        />
                        {form.formState.errors.username && (
                            <p className='mt-1.5 text-red-600 text-xs'>{form.formState.errors.username.message}</p>
                        )}
                    </div>
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
                    <div>
                        <Input
                            type="password"
                            placeholder="Confirm password"
                            {...form.register('confirmPassword')}
                        />
                        {form.formState.errors.confirmPassword && (
                            <p className='mt-1.5 text-red-600 text-xs'>{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-500 mr-2">OR CONTINUE WITH</span>
                        <Button disabled={query.isPending} variant="outline" className="flex items-center justify-center">
                            <FaGoogle className="mr-2" />
                            Google
                        </Button>
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-gray-500">
                            Have an account?{' '}
                            <Link href="/login" className="text-blue-500 hover:underline">
                                Click here to Login
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;