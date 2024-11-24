import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const primaryTranslationServiceURL = "http://127.0.0.1:5000/translate";
export const fallbackTranslationServiceURL = "https://translate.argosopentech.com/";

export const EuropeLanguages = [  
  { value: "bg", label: "Bulgarian" },
  { value: "cs", label: "Czech" },  
  { value: "de", label: "German" },  
  { value: "el", label: "Greek" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "es", label: "Spanish" },
  { value: "sv", label: "Swedish" },
]


export const AsiaLanguages = [
  { value: "bn", label: "Bengali" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "id", label: "Indonesian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ms", label: "Malay" },
  { value: "th", label: "Thai" },
]

export function loadAutoScrollState(): boolean {
  if (typeof window !== 'undefined') {
      const storedAutoScrollState = localStorage.getItem('autoScrollEnabled');
      return storedAutoScrollState ? JSON.parse(storedAutoScrollState) : true;
  }
  return true;
}

export const getDueDate = (date: string | Date) => {
  const dueDate = new Date(date);
  return dueDate.toLocaleDateString(navigator.language, {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
  });
};