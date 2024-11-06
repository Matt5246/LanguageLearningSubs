'use client'
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Edit } from "lucide-react";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import DeleteWord from "./DeleteWord";

interface EditWordDrawerProps {
    wordData: any;
    onSave?: (updatedWord: any) => void;
}

const EditWord: React.FC<EditWordDrawerProps> = ({ wordData, onSave }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingWord, setEditingWord] = useState(wordData);
    const { toast } = useToast();
    useEffect(() => {
        setEditingWord(wordData)
    }, [wordData])
    const handleSaveEdit = async () => {
        try {
            const response = await axios.post('/api/hardWords/edit', { hardWord: editingWord });
            if (onSave) {
                onSave(editingWord);
            }
            toast({
                title: "Success",
                description: "Word updated successfully!",
            });
        } catch (error) {
            console.error('Error updating word:', error);
            toast({
                title: "Error",
                description: "Failed to update word.",
                variant: "destructive",
            });
        }
        setIsDrawerOpen(false);
    };
    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center space-x-2 xs:space-x-0"
            >
                <Edit size={24} />
                <span className="hidden sm:inline">Edit word</span>
            </Button>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Edit Hard Word</DrawerTitle>
                            <DrawerDescription>Edit the details of the selected hard word.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 space-y-1.5">
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Word</label>
                            <Input
                                type="text"
                                value={editingWord?.word || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Translation</label>
                            <Input
                                type="text"
                                value={editingWord?.translation || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, translation: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Lemma</label>
                            <Input
                                type="text"
                                value={editingWord?.lemma || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, lemma: e.target.value })}
                            />
                            <label className="flex flex-col space-y-1.5 text-lg font-semibold">Part of Speech</label>
                            <Input
                                type="text"
                                value={editingWord?.pos || ''}
                                onChange={(e) => setEditingWord({ ...editingWord, pos: e.target.value })}
                            />
                            <div className="mt-3">
                                <Accordion type="single" collapsible>
                                    {editingWord?.sentences?.map((sentence: any, index: number) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className='font-semibold'>{sentence.sentence}</AccordionTrigger>
                                            <AccordionContent>
                                                <Input
                                                    type="text"
                                                    value={sentence?.translation || ""}
                                                    onChange={(e) => {
                                                        const updatedSentences = [...editingWord.sentences];
                                                        updatedSentences[index].translation = e.target.value;
                                                        setEditingWord({ ...editingWord, sentences: updatedSentences });
                                                    }}
                                                    className="w-full"
                                                    disabled
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button onClick={handleSaveEdit}>Save</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default EditWord;