'use client'
import { useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EuropeLanguages, AsiaLanguages } from '@/lib/utils';
import TranslateSubtitle from "@/app/home/subtitles/TranslateSubtitle";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ToggleAutoScrollButton } from "./ToggleAutoScrollButton";

const SettingsDrawerContent = ({ selectedSub, setTargetLanguage, setSourceLanguage }: { selectedSub: Subtitle | null, setTargetLanguage: (language: string) => void, setSourceLanguage: (language: string) => void }) => {
    const [storedTargetLanguage, setStoredTargetLanguage] = useLocalStorage("targetLanguage", "");
    const [storedSourceLanguage, setStoredSourceLanguage] = useLocalStorage("sourceLanguage", "auto");

    useEffect(() => {
        if (!storedTargetLanguage) {
            setStoredTargetLanguage("de");
            setTargetLanguage("de");
        } else {
            setTargetLanguage(storedTargetLanguage);
        }
        setSourceLanguage(storedSourceLanguage);
    }, [storedTargetLanguage, storedSourceLanguage, setTargetLanguage, setSourceLanguage]);

    return (
        <DrawerContent>
            <DrawerHeader className="text-left">
                <DrawerTitle className="text-center">Edit subtitle profile</DrawerTitle>
                <DrawerDescription className="text-center">
                    Make changes to your subtitle profile here. Click save when you are done.
                </DrawerDescription>
                <DrawerTitle>Edit preferences</DrawerTitle>
                <DrawerDescription>
                    Pick your preferred language to translate to.
                </DrawerDescription>
                <Select onValueChange={(value) => setStoredTargetLanguage(value)} defaultValue={storedTargetLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="font-bold text-md">Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                            <SelectLabel className="font-bold text-md">Asia</SelectLabel>
                            {AsiaLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DrawerDescription>
                    Optional, pick your subtitles language you want to get from YouTube, if exists.
                </DrawerDescription>
                <Select onValueChange={(value) => setStoredSourceLanguage(value)} defaultValue={storedSourceLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem className="font-bold" key="auto" value="auto">
                                auto
                            </SelectItem>
                            <SelectLabel className="font-bold">Europe</SelectLabel>
                            {EuropeLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                            <SelectLabel className="font-bold">Asia</SelectLabel>
                            {AsiaLanguages.map((language) => (
                                <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="my-2 space-x-4 ">

                </div>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                    <Button variant="default" className="mr-2">Save</Button>
                </DrawerClose>
                <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    );
};

export default SettingsDrawerContent;
