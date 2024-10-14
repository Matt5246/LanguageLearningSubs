'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayIcon } from '@radix-ui/react-icons'
import { UploadIcon } from "@radix-ui/react-icons"
import { AddSubtitlesButton } from '@/components/AddSubtitlesButton'

interface FileBrowserProps {
    onVideoSelect: (url: string) => void;
    handleAddSubtitles?: any;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ handleAddSubtitles, onVideoSelect }: FileBrowserProps) => {
    const [folders, setFolders] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [subtitlesConverted, setSubtitlesConverted] = useState()
    const [subtitleText, setSubtitleText] = useState<string>('');

    const handleFolderSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setFolders(filesArray);
        }
    };

    const handleFolderClick = (file: File) => {
        // const filteredFiles = folders.filter(file => file.webkitRelativePath.startsWith(folder.webkitRelativePath));
        // setCurrentPath(filteredFiles);
        if (file.name.endsWith('.srt') || file.name.endsWith('.ass')) {
            readFileContent(file);
            setSelectedFile(file);
        }
    };

    const handleBackClick = () => {
        setCurrentPath([]);
        setSubtitleText('');
    };

    const handleFileClick = (file: File) => {
        if (file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
            onVideoSelect(URL.createObjectURL(file));
            setSelectedFile(file);
            setSubtitleText('');
        } else if (file.name.endsWith('.srt') || file.name.endsWith('.ass')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setSubtitleText(text);
                setSelectedFile(file);
            };
            reader.readAsText(file);
        }
    };
    const readFileContent = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setSubtitleText(text);
        };
        reader.readAsText(file);
    };
    const renderFiles = () => {
        const filesToRender = currentPath.length > 0 ? currentPath : folders;
        return filesToRender.map((file, index) => {
            const isFolder = file.type === '';
            return (
                <Card className='cursor-pointer' key={index} onClick={() => isFolder ? handleFolderClick(file) : handleFileClick(file)}>
                    <CardHeader>
                        <CardTitle>{isFolder ? '📁' : '📄'} {file.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) && (
                            <div className="mt-2">
                                <PlayIcon />
                            </div>
                        )}
                        {(file.name.endsWith('.srt') || file.name.endsWith('.ass')) && (
                            <div className="mt-2 flex justify-between items-center space-x-2 ">
                                <UploadIcon />
                                <AddSubtitlesButton handleAddSubtitles={handleAddSubtitles} defaultSubs={subtitleText} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <>
            <input
                type="file"
                //@ts-ignore bcs webkitdirectory works and allows folder selection
                webkitdirectory="true"
                multiple
                onChange={handleFolderSelection}
            />
            <Button onClick={handleBackClick} disabled={currentPath.length === 0}>Back</Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                {renderFiles()}
            </div>
        </>
    );
};

export default FileBrowser;
