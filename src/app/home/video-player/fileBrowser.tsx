'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SubtitlePopoverContent } from '@/components/AddSubtitlesButton';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Upload, FolderOpen, ChevronLeft, FileVideo, FileText, Calendar, HardDrive } from 'lucide-react';

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
            setCurrentPath([]);
        }
    };

    const handleFolderClick = (folderName: string) => {
        setCurrentPath((prev) => [...prev, folderName]);
        setSelectedFolder(folderName);
    };

    const handleBackClick = () => {
        if (currentPath.length > 0) {
            setCurrentPath((prev) => prev.slice(0, -1));
            setSelectedFolder(null);
        } else {
            setFolders([]);
            setSelectedFolder(null);
            setSubtitleText('');
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
        );

        return (
            <div className='my-5 space-y-6'>
                {groupedFiles.videos.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Videos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {groupedFiles.videos.map((file, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card
                                        className={`flex flex-col h-full cursor-pointer transition-colors duration-200 ${fileTitle === file.name ? 'bg-primary/10' : 'hover:bg-primary/5'
                                            }`}
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <CardHeader className="pb-2">
                                            <CardTitle className='text-sm font-medium truncate'>{file.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className='flex-grow flex items-center justify-center p-4'>
                                            <FileVideo className="w-12 h-12 text-primary/60" />
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                                            <PlayCircle className="w-4 h-4" />
                                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {groupedFiles.subtitles.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Subtitles</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {groupedFiles.subtitles.map((file, index) => (
                                <HoverCard key={file.name + index}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Card className="flex flex-col cursor-pointer transition-colors duration-200 hover:bg-primary/5">
                                                <HoverCardTrigger>
                                                    <CardContent className="flex flex-col items-center justify-center space-y-2 p-4">
                                                        <FileText className="w-8 h-8 text-primary/60" />
                                                        <span className="text-sm font-medium text-center truncate w-full">
                                                            {file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '')}
                                                        </span>
                                                        <motion.div whileHover={{ scale: 1.2 }}>
                                                            <Upload className="w-4 h-4" />
                                                        </motion.div>
                                                    </CardContent>
                                                </HoverCardTrigger>
                                            </Card>
                                        </PopoverTrigger>
                                        <HoverCardContent className="p-4 space-y-2 w-64">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{file.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    <Calendar className="inline mr-1 h-3 w-3" />
                                                    Modified: {new Date(file.lastModified).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <HardDrive className="inline mr-1 h-3 w-3" />
                                                    Size: {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </HoverCardContent>
                                        <SubtitlePopoverContent
                                            handleAddSubtitles={handleAddSubtitles}
                                            defaultSubs={{
                                                text: subtitleText,
                                                title: file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '')
                                            }}
                                        />
                                    </Popover>
                                </HoverCard>
                            ))}
                        </div>
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
            <div className="flex flex-wrap gap-2 mt-4">
                <AnimatePresence>
                    {foldersInCurrentPath.map((folderName, index) => (
                        <motion.div
                            key={folderName + index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <Button
                                variant="outline"
                                className={`cursor-pointer ${selectedFolder === folderName ? 'bg-primary text-primary-foreground' : ''}`}
                                onClick={() => handleFolderClick(folderName)}
                            >
                                <FolderOpen className="w-4 h-4 mr-2" />
                                {folderName}
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="p-4 space-y-6">
            {currentPath.length === 0 && folders.length === 0 ? (
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Upload Your Data</h1>
                    <p className="text-lg text-muted-foreground">Please select a folder to upload your video and subtitle files.</p>
                    <label htmlFor="folder-upload" className="inline-block">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 cursor-pointer hover:bg-primary/90 transition-colors duration-200">
                            <FolderOpen className="inline-block w-5 h-5 mr-2" />
                            Choose Folder
                        </div>
                    </label>
                    <input
                        id="folder-upload"
                        type="file"
                        webkitdirectory="true"
                        multiple
                        className="hidden"
                        onChange={handleFolderSelection}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleBackClick} disabled={currentPath.length === 0 && folders.length === 0}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="text-lg font-semibold">
                            {currentPath.length > 0 ? currentPath.join(' / ') : 'Root'}
                        </div>
                    </div>
                    {renderFolders()}
                    {renderFiles()}
                </div>
            )}
        </div>
    );
};

export default FileBrowser;