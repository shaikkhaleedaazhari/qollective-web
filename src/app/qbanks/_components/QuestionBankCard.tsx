"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



const question = {
    title: "Data Structures and Algorithm",
    creator: "hashiq",
    noOfQuestions: 120,
    lastModified: new Date(),
    favorites: 240,
    subject: "Computer Science"
}
const QuestionBankCard = () => {
    function handleFavoriteClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation()
        console.log("click")
    }
    return (
        <Link className='block' href="/">
            <Card className='hover:bg-gray-100 transition-colors'>
                <CardContent className='py-8'>
                    <div className='flex gap-4'>
                        <div>
                            <Image src="/images/q-mark.jpg" alt='question-bank-img' width={200} height={200} className='object-cover w-16 h-16 rounded-full' />
                        </div>
                        <div className='flex justify-between flex-grow'>
                            <div className='space-y-1'>
                                <h3 className='text-2xl font-semibold'>{question.title}</h3>
                                <p className='text-sm text-gray-700'>{question.subject} · {question.noOfQuestions} Questions · last modified: {question.lastModified.toLocaleDateString()}</p>
                                <p className='text-sm text-gray-700'>by @{question.creator}</p>
                            </div>
                            <div className='flex text-gray-500'>
                                <button onClick={handleFavoriteClick} className='gap-1.5 inline-flex justify-center items-center h-fit py-2 px-1.5'>
                                    <Star />
                                    <p>{question.favorites}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default QuestionBankCard
