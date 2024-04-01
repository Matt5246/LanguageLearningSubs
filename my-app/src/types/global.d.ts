interface Caption {
    subtitleDataId?: string,
    text: string;
    duration: number;
    offset: number; //time of appearance
}

type Subtitle = {
    subtitleTitle: string;
    youtubeUrl: string;
    subtitleData?: SubtitleData[];
}

type SubtitleData = {
    text: string;
    translation: string;
    duration: number;
    offset: number;
}

type SubtitlesDropDownProps = {
    data: Subtitle[];
    setSelectedSubtitle: (subtitle: Subtitle | null) => void;
}