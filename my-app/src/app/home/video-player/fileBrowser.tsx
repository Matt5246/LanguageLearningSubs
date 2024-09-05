'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoPlayer from '@/components/VideoPlayer';

const FileBrowser = () => {
    const [folders, setFolders] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [subtitleText, setSubtitleText] = useState<string>('');

    const handleFolderSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setFolders(filesArray);
        }
    };

    const handleFolderClick = (folder: File) => {
        const filteredFiles = folders.filter(file => file.webkitRelativePath.startsWith(folder.webkitRelativePath));
        setCurrentPath(filteredFiles);
    };

    const handleBackClick = () => {
        setCurrentPath([]);
        setSubtitleText(''); // Clear subtitle text when going back
    };

    const handleFileClick = (file: File) => {

    };

    const renderFiles = () => {
        const filesToRender = currentPath.length > 0 ? currentPath : folders;
        return filesToRender.map((file, index) => {
            const isFolder = file.type === '';

            // if (file.name.endsWith('.mkv')) {
            //     const url = URL.createObjectURL(file);
            //     setSelectedFile(file);
            //     setSubtitleText(''); // Clear subtitle text when a video file is clicked
            // } else if (file.name.endsWith('.srt') || file.name.endsWith('.ass')) {
            //     const reader = new FileReader();
            //     reader.onload = (e) => {
            //         const text = e.target?.result as string;
            //         console.log('Subtitle content:', text); // Debugging line
            //         setSubtitleText(text);
            //         setSelectedFile(file);
            //         setVideoUrl(''); // Clear video URL when a subtitle file is clicked
            //     };
            //     reader.readAsText(file);
            // }
            return (
                <Card key={index} onClick={() => isFolder ? handleFolderClick(file) : handleFileClick(file)}>
                    <CardHeader>
                        <CardTitle>{isFolder ? '📁' : '📄'} {file.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {file.name.endsWith('.mkv') && (
                            <div className="mt-2">
                                <VideoPlayer url={URL.createObjectURL(file)} light={true} />
                            </div>
                        )}
                        {(file.name.endsWith('.srt') || file.name.endsWith('.ass')) && (
                            <div className="mt-2">
                                {file === selectedFile && subtitleText && (
                                    <pre>{subtitleText}</pre>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            );
        });
    };

    return (
        <div>
            <input
                type="file"
                //@ts-ignore bcs webkitdirectory works and allows folder selection
                webkitdirectory="true"
                multiple
                onChange={handleFolderSelection}
            />
            <Button onClick={handleBackClick} disabled={currentPath.length === 0}>Back</Button>
            <div className="grid grid-cols-3 gap-4 my-4">
                {renderFiles()}
            </div>
        </div>
    );
};

export default FileBrowser;
