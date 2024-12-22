'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface WordTableProps {
  words: Array<{
    word: string
    translation: string
    pos?: string
    repetitions: number
    dueDate: Date
  }>
  selectedWords: string[]
  onSelectionChange: (words: string[]) => void
}

type SortField = 'word' | 'translation' | 'pos' | 'repetitions'
type SortDirection = 'asc' | 'desc'

export function WordTable({ words, selectedWords, onSelectionChange }: WordTableProps) {
  const [sortField, setSortField] = useState<SortField>('word')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedWords = [...words].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    
    if (sortField === 'repetitions') {
      return (a[sortField] - b[sortField]) * direction
    }
    
    const aValue = a[sortField]?.toString().toLowerCase() || ''
    const bValue = b[sortField]?.toString().toLowerCase() || ''
    return aValue.localeCompare(bValue) * direction
  })

  const toggleWordSelection = (word: string) => {
    const newSelection = selectedWords.includes(word)
      ? selectedWords.filter(w => w !== word)
      : [...selectedWords, word]
    onSelectionChange(newSelection)
  }

  const toggleAll = () => {
    if (selectedWords.length === words.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(words.map(w => w.word))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedWords.length === words.length}
                onCheckedChange={toggleAll}
                aria-label="Select all words"
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('word')}>
              <p className="flex items-center">
                Word 
                {sortField === 'word' && <span className="">{sortDirection === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}</span>}
              </p> 
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('translation')}>
              <p className="flex items-center">
                Translation 
                {sortField === 'translation' && <span className="">{sortDirection === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}</span>}
              </p>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('pos')}>
              <p className="flex items-center">
                Part of Speech 
                {sortField === 'pos' && <span className="">{sortDirection === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}</span>}
              </p>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('repetitions')}>
              <p className="flex items-center">
                Repetitions 
                {sortField === 'repetitions' && <span className="">{sortDirection === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}</span>}
              </p>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('dueDate')}>
              <p className="flex items-center">
                Next Review
                {sortField === 'dueDate' && <span className="">{sortDirection === 'asc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}</span>}
              </p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWords.map((word, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedWords.includes(word.word)}
                  onCheckedChange={() => toggleWordSelection(word.word)}
                  aria-label={`Select ${word.word}`}
                  className="ml-2"
                />
              </TableCell>
              <TableCell className="font-medium">{word.word}</TableCell>
              <TableCell>{word.translation}</TableCell>
              <TableCell>{word.pos || '-'}</TableCell>
              <TableCell>{word.repetitions}</TableCell>
              <TableCell>
                {word.dueDate ? new Date(word.dueDate).toLocaleDateString() : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}