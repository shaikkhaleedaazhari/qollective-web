import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import QuestionBankCard from './_components/QuestionBankCard'
import SearchBar from './_components/SearchBar'

const QuestionBankPage = () => {
    return (

        <div className='mt-4'>
            <SearchBar />
            <div className='mt-4 space-y-2.5'>
                <QuestionBankCard />
                <QuestionBankCard />
                <QuestionBankCard />
                <QuestionBankCard />
                <QuestionBankCard />
            </div>
        </div>
    )
}

export default QuestionBankPage
