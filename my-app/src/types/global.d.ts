interface Caption {
    id?: number,
    subtitleDataId?: string,
    text: string;
    duration: number;
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
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
}

interface SubtitleData {
    word?: string;
    translation?: string;
    dur?: number | float;
    start?: number | float;
}

interface HardWord {
    word: string;
    translation?: string;
    pos?: string; // Part of speech
    lemma?: string;
    senteces?: senteces[];
}
interface senteces {
    sentence: String
    translation?: String
}