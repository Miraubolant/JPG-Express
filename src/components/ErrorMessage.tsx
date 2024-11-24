import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center text-red-500 flex items-center justify-center gap-1 text-sm py-4">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}