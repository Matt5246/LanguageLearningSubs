import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import DeleteWord from '../flashcards/learn/DeleteWord';
import EditWord from '../flashcards/learn/EditWord';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TextQuote } from 'lucide-react'

interface OptionsDialogContentProps {
    word: any;
}
const OptionsDialog: React.FC<OptionsDialogContentProps> = ({ word }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <TextQuote className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage hardWord</DialogTitle>
                    <DialogDescription>
                        All options to manage your word. <strong>{word?.word}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <DeleteWord hardWord={word?.word} />
                    <EditWord wordData={word} />
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default OptionsDialog