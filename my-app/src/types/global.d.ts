interface Caption {
    id?: number,
    subtitleDataId?: string,
    text: string;
    end: number;
    offset: number; //time of appearance
    start?: number;
    translation?: string;
}

// type Subtitle = {
//     SubtitleId: string | null;
//     subtitleTitle: string;
//     youtubeUrl: string;
//     subtitleData?: SubtitleData[];
// }

// type SubtitleData = {
//     text?: string;
//     translation?: string;
//     dur?: number | float;
//     start?: number | float;
// }


interface Subtitle {
    userId?: string;
    SubtitleId?: string | null;
    youtubeUrl?: string;
    subtitleTitle?: string;
    episode?: number;
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
}

interface SubtitleData {
    word?: string;
    text?: string;
    translation?: string;
    end?: number | float;
    start?: number | float;
}

interface HardWord {
    learnState?: number;
    word: string | undefined;
    translation?: string;
    pos?: string; // Part of speech
    lemma?: string;
    createdAt?: string;
    sentences?: sentences[];
}

interface sentences {
    sentence: string
    translation?: string
}

type GroupedSubtitles = Record<string, Subtitle[]>;