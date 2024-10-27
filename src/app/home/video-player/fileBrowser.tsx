'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayIcon, UploadIcon } from '@radix-ui/react-icons';
import { SubtitlePopoverContent } from '@/components/AddSubtitlesButton';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays } from "lucide-react"
import { motion } from 'framer-motion';

interface FileBrowserProps {
    onVideoSelect: (url: string, vidTitle: string) => void;
    handleAddSubtitles?: any;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ handleAddSubtitles, onVideoSelect }) => {
    const [folders, setFolders] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [subtitleText, setSubtitleText] = useState<string>('');
    const [fileTitle, setFileTitle] = useState<string>('');

    const handleFolderSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setFolders(filesArray);
            setCurrentPath([]); // Reset path when new files are selected
        }
    };

    const handleFolderClick = (folderName: string) => {
        setCurrentPath((prev) => [...prev, folderName]);
        setSelectedFolder(folderName);
    };

    const handleBackClick = () => {
        if (currentPath.length > 0) {
            setCurrentPath((prev) => prev.slice(0, -1)) // Go back one level in the folder structure
            setSelectedFolder(null)
        } else {
            setFolders([])
            setSelectedFolder(null)
            setSubtitleText('')
        }
    };

    const handleFileClick = (file: File) => {
        if (file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
            onVideoSelect(URL.createObjectURL(file), file.name);
            setFileTitle(file.name);
        } else if (file.name.endsWith('.srt') || file.name.endsWith('.ass')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setSubtitleText(text);
            };
            reader.readAsText(file);
        }
    };

    const getFolderContent = () => {
        return folders.filter((file) => {
            const filePathParts = file.webkitRelativePath.split('/');
            const currentFolderDepth = currentPath.length;
            return filePathParts.slice(0, currentFolderDepth).join('/') === currentPath.join('/');
        });
    };

    const renderFiles = () => {
        const filesToRender = getFolderContent();

        const groupedFiles = filesToRender.reduce(
            (acc: { videos: File[]; subtitles: File[] }, file) => {
                if (file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
                    acc.videos.push(file);
                } else if (file.name.endsWith('.srt') || file.name.endsWith('.ass')) {
                    acc.subtitles.push(file);
                }
                return acc;
            },
            { videos: [], subtitles: [] }
        )

        return (
            <div className='my-5'>
                {groupedFiles.videos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                        {groupedFiles.videos.map((file, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    className={`flex flex-col h-full cursor-pointer hover:bg-blue-300 hover:opacity-60 ${fileTitle === file.name ? 'bg-blue-300 opacity-60' : ''}`}
                                    key={idx}
                                    onClick={() => handleFileClick(file)}
                                >
                                    <CardHeader>
                                        <CardTitle className='text-lg'>🎞️ {file.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex-grow'></CardContent>
                                    <CardFooter className="flex justify-between items-center mt-2">
                                        <PlayIcon />
                                        <span>size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {groupedFiles.subtitles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                        {groupedFiles.subtitles.map((file, index) => (
                            <HoverCard key={file.name + index}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Card className="flex flex-col cursor-pointer hover:bg-blue-300 hover:opacity-60" onClick={() => handleFileClick(file)}>
                                            <HoverCardTrigger >
                                                <CardContent className="flex justify-between items-center space-x-2 mt-5 ">
                                                    <span className="truncate">{file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '')}</span>
                                                    <motion.div whileHover={{ scale: 1.2 }}>
                                                        <UploadIcon />
                                                    </motion.div>
                                                </CardContent>
                                            </HoverCardTrigger>
                                        </Card>
                                    </PopoverTrigger>
                                    <HoverCardContent className="p-4 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-md font-semibold break-words break-all">{file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground ">
                                            <span className="flex justify-between items-center"><CalendarDays className="mr-2 h-4 w-4 opacity-70" />{"modified "}{new Date(file.lastModified).toLocaleDateString()}</span>
                                            <span>{(file.size / 1024).toFixed(2)} KB</span>
                                        </div>
                                    </HoverCardContent>
                                    <SubtitlePopoverContent handleAddSubtitles={handleAddSubtitles} defaultSubs={{ text: subtitleText, title: file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '') }} />
                                </Popover>
                            </HoverCard>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFolders = () => {
        const foldersInCurrentPath = Array.from(
            new Set(
                folders
                    .filter((file) => {
                        const filePathParts = file.webkitRelativePath.split('/');
                        const isDeeperFolder = filePathParts.length > currentPath.length + 1;
                        const isInCurrentPath = filePathParts.slice(0, currentPath.length).join('/') === currentPath.join('/');
                        return isDeeperFolder && isInCurrentPath;
                    })
                    .map((file) => file.webkitRelativePath.split('/')[currentPath.length])
            )
        );

        return (
            <>
                {foldersInCurrentPath.map((folderName, index) => (
                    <motion.div
                        key={folderName + index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Button
                            className={`cursor-pointer ml-1.5 ${selectedFolder === folderName ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => handleFolderClick(folderName)}
                        >
                            📁 {folderName}
                        </Button>
                    </motion.div>
                ))}
                {foldersInCurrentPath.length === 0 && (
                    <div className='text-xl ml-auto text-center w-full'>{currentPath[currentPath.length - 1]}</div>
                )}
            </>
        );
    };

    return (
        <div className="p-0 md:p-5">

            <div className='flex w-full'>
                {currentPath.length === 0 && (
                    <div>
                        {
                            folders.length === 0 && (
                                <>
                                    <h1 className="text-2xl font-bold">Upload Your Data</h1>
                                    <p className="text-md mt-2 mb-4">Please select a folder to upload your video and subtitle files.</p>
                                </>
                            )
                        }
                        <input
                            type="file"
                            //@ts-ignore because webkitdirectory works and allows folder selection
                            webkitdirectory="true"
                            multiple
                            onChange={handleFolderSelection}
                        />
                    </div>
                )}
                {currentPath.length === 0 ? (
                    <>{renderFolders()}</>
                ) : (
                    <>
                        <div className='flex w-full flex-col'>
                            <div className='flex w-full'>
                                <Button variant="secondary" onClick={handleBackClick} disabled={currentPath.length === 0 && folders.length === 0}>
                                    Back
                                </Button>
                                {renderFolders()}
                            </div>
                            <div className='flex w-full'>
                                {renderFiles()}

                            </div>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default FileBrowser;
