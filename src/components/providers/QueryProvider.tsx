"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { Children } from "react"



const queryClient = new QueryClient()

function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider
