import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

type ContainerProps = React.ComponentProps<"div">

const Container = ({ children, className, ...props }: ContainerProps) => {
    return (
        <div className={cn(`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full`, className)} {...props}>
            {children}
        </div>
    )
}

export default Container