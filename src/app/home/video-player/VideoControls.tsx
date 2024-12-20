import { Save, Subtitles, Upload } from "lucide-react"
import { DataTable } from "@/components/Subtitles/SubtitlesListTanstack"
import { AddSubtitlesButton } from "@/components/AddSubtitlesButton"
import VideoPlayer from "@/components/VideoPlayer"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { GearButton } from "@/components/SettingsButton"
import { Input } from "@/components/ui/input"
import { DrawerTrigger } from "@/components/ui/drawer"





export interface VideoUploadAreaProps {
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    videoFile: File | null;
    url: string;
}
export interface SubtitleAreaProps {
    subtitleConverted: Caption[];
    height: string;
}
export interface ControlButtonsProps {
    selectedSub: Subtitle | null;
    handleAddSubtitles: (subtitleConverted: any, updateTitle: any) => void;
    refetch2: () => void;
    isFetching: boolean;
    titleAndEpisode: { subtitleTitle: string; episode: string | null } | undefined;
    subtitleConverted: any;
}

export const VideoUploadArea: React.FC<VideoUploadAreaProps> = ({ onDrop, onChange, videoFile, url }) => (
    <div
        className={`relative h-full ${!videoFile && !url ? 'border-2 border-dashed border-gray-300' : 'border-none'}  rounded-lg flex items-center justify-center`}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
    >
        {!videoFile && !url ? (
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Drag and drop your video here or</p>
                <Input
                    type="file"
                    className="mt-2 mx-auto w-64"
                    onChange={onChange}
                />
            </div>
        ) : (
            <VideoPlayer url={url} track={[]} />
        )}
    </div>
)

export const SubtitleArea: React.FC<SubtitleAreaProps> = ({ subtitleConverted, height }) => (
    subtitleConverted?.length > 0 ? (
        <DataTable captions={subtitleConverted as Caption[]} height={height} />
    ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[64px]">

            <Subtitles className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-600">No subtitles detected. Add subtitles or select a video with embedded subtitles.</p>
        </div>
    )
)

export const ControlButtons: React.FC<ControlButtonsProps> = ({ selectedSub, handleAddSubtitles, refetch2, isFetching, titleAndEpisode, subtitleConverted }) => (
    <div className="flex gap-2">
        {!selectedSub && (
            <>
                <AddSubtitlesButton handleAddSubtitles={handleAddSubtitles} />
                <HoverCard>
                    <HoverCardTrigger>
                        <Button onClick={() => refetch2()} disabled={isFetching}>
                            <Save className="w-4 h-4 mr-2" />
                            {isFetching ? 'Saving...' : 'Save Subtitles'}
                        </Button>
                    </HoverCardTrigger>
                    {titleAndEpisode && (
                        <HoverCardContent className="p-4 shadow-lg rounded-lg">
                            <div className="text-sm">
                                <span className="font-semibold break-words">{titleAndEpisode?.subtitleTitle}</span>
                                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                    {titleAndEpisode?.episode && (
                                        <p>Episode: <span className="font-medium">{titleAndEpisode?.episode}</span></p>
                                    )}
                                    <p>Rows: <span className="font-medium">{subtitleConverted?.length}</span></p>
                                </div>
                            </div>
                        </HoverCardContent>
                    )}
                </HoverCard>
                <DrawerTrigger asChild>
                    <GearButton />
                </DrawerTrigger>
            </>
        )}

    </div>
)

