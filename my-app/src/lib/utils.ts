import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EuropeLanguages = [
  { value: "cs", label: "Czech" },
  { value: "de", label: "German" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "es", label: "Spanish" },
  { value: "sv", label: "Swedish" }
]


export const AsiaLanguages = [
  { value: "bn", label: "Bengali" },
  { value: "my", label: "Burmese" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "id", label: "Indonesian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ms", label: "Malay" },
  { value: "th", label: "Thai" },
  { value: "tl", label: "Tagalog" },
  { value: "vi", label: "Vietnamese" },
]