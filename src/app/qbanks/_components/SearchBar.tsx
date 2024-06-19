"use client"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem, SelectLabel } from '@/components/ui/select'
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SearchBarProps = {
  examTypes: string[];
  searchTerm: string;
  examType: string;
};

export default function SearchBar({
  examTypes,
  searchTerm,
  examType,
}: SearchBarProps) {
  const queryParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedSearch !== "") {
      url.searchParams.set("search", debouncedSearch);
    } else {
      url.searchParams.delete("search");
    }
    router.push(url.pathname + url.search);
  }, [debouncedSearch, router]);
  return (
    <div className="flex gap-4">
      <Input
        className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search QBanks"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <Select
        value={examType}
        onValueChange={(val) => {
          const url = new URL(window.location.href);

          if (val === "All") {
            url.searchParams.delete("exam");
          } else {
            url.searchParams.set("exam", val);
          }
          router.push(url.pathname + url.search);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select exam" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Exams</SelectLabel>

            <SelectItem value="All">All</SelectItem>
            {examTypes.map((examType) => (
              <SelectItem key={examType} value={examType}>
                {examType}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}