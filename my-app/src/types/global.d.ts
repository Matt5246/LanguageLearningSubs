interface Caption {
    subtitleDataId?: string,
    text: string;
    duration: number;
    offset: number; //time of appearance
    start?: number;
    translation?: string;
}

type Subtitle = {
    subtitleTitle: string;
    youtubeUrl: string;
    subtitleData?: SubtitleData[];
}

type SubtitleData = {
    text?: string;
    translation?: string;
    dur?: number | float;
    start?: number | float;
}

type SubtitlesDropDownProps = {
    data: Subtitle[];
    setSelectedSubtitle: (subtitle: Subtitle | null) => void;
}
