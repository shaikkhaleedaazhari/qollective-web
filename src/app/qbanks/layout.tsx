import Container from '@/components/Container'
import Header from '@/components/Header'
import React from 'react'

const QuestionBankLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Container className="flex-grow">{children}</Container>
        </div>
    )
}

export default QuestionBankLayout
