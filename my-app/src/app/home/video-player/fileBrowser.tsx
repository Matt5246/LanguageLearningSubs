'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayIcon, UploadIcon } from '@radix-ui/react-icons';
import { AddSubtitlesButton, SubtitlePopoverContent } from '@/components/AddSubtitlesButton';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

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
            setCurrentPath((prev) => prev.slice(0, -1)); // Go back one level in the folder structure
            setSelectedFolder(null); // Reset selected folder when navigating back
        } else {
            setFolders([]); // Clear everything when going back from the root
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
            <div className='my-5'>
                {groupedFiles.videos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                        {groupedFiles.videos.map((file, idx) => (
                            <Card
                                className={`flex flex-col h-full cursor-pointer ${fileTitle === file.name ? 'bg-blue-300 opacity-60' : ''}`}
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
                        ))}
                    </div>
                )}

                {groupedFiles.subtitles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                        {groupedFiles.subtitles.map((file, idx) => (
                            <Popover key={idx}>
                                <PopoverTrigger asChild>
                                    <Card className="flex flex-col cursor-pointer" onClick={() => handleFileClick(file)}>
                                        <CardContent className='flex-grow'>
                                            <div className="flex justify-between items-center space-x-2 mt-5">
                                                <span className="truncate">{file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '')}</span> <div><UploadIcon /></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </PopoverTrigger>
                                <SubtitlePopoverContent handleAddSubtitles={handleAddSubtitles} defaultSubs={{ text: subtitleText, title: file.name.replace(/(\.srt|\.ass|\.txt|\s*\.\*\s*)$/, '') }} />
                            </Popover>
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
                    <Button
                        key={index}
                        className={`cursor-pointer ml-1.5 ${selectedFolder === folderName ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => handleFolderClick(folderName)}
                    >
                        📁 {folderName}
                    </Button>
                ))}
                {foldersInCurrentPath.length === 0 && (
                    <div className='text-xl ml-auto text-center w-full'>{currentPath[currentPath.length - 1]}</div>
                )}
            </>
        );
    };

    return (
        <>
            {currentPath.length === 0 && (
                <input
                    type="file"
                    //@ts-ignore because webkitdirectory works and allows folder selection
                    webkitdirectory="true"
                    multiple
                    onChange={handleFolderSelection}
                />
            )}
            <Button variant="secondary" onClick={handleBackClick} disabled={currentPath.length === 0 && folders.length === 0}>
                Back
            </Button>
            {currentPath.length === 0 ? (
                <>{renderFolders()}</>
            ) : (
                <>
                    {renderFolders()}
                    {renderFiles()}
                </>
            )}
        </>
    );
};

export default FileBrowser;
