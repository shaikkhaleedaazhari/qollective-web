"use client"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem, SelectLabel } from '@/components/ui/select'
import { useState } from 'react'

export default function SearchBar() {
    const [exam, setExam] = useState("JEE")
    return (
        <div className="flex gap-4">
            <Input
                className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search QBanks"
            />
            <Select value={exam} onValueChange={(value) => setExam(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Exams</SelectLabel>
                        <SelectItem value="JEE">JEE</SelectItem>
                        <SelectItem value="GATE">GATE</SelectItem>
                        <SelectItem value="NEET">NEET</SelectItem>
                        <SelectItem value="PSC-KERALA">PSC - Kerala</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}