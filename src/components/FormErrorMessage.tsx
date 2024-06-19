import { cn } from "@/lib/utils";
import React from "react";

type FormErrorMessageProps = {
  message: string | undefined | null;
  className?: string;
};

const FormErrorMessage = ({ message, className }: FormErrorMessageProps) => {
  return <p className={cn("text-sm text-red-500", className)}>{message}</p>;
};

export default FormErrorMessage;
