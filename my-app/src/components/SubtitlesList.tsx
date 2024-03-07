import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const subtitles = [
    {
        captions: "Hello, how are you?",
        translation: "Hallo, wie geht es dir?",
        time: "00:00:05",
    },
    {
        captions: "I'm good, thank you!",
        translation: "Mir geht es gut, danke!",
        time: "00:00:10",
    },
    {
        captions: "What have you been up to?",
        translation: "Was hast du gemacht?",
        time: "00:00:15",
    },
    {
        captions: "I've been working on a new project.",
        translation: "Ich habe an einem neuen Projekt gearbeitet.",
        time: "00:00:20",
    },
    {
        captions: "That sounds interesting. Tell me more about it.",
        translation: "Das klingt interessant. Erzähl mir mehr darüber.",
        time: "00:00:25",
    },
    {
        captions: "Sure, it's a video editing software.",
        translation: "Ja, es ist eine Videobearbeitungssoftware.",
        time: "00:00:30",
    },
    {
        captions: "I've added some new features to improve the user experience.",
        translation: "Ich habe einige neue Funktionen hinzugefügt, um das Benutzererlebnis zu verbessern.",
        time: "00:00:35",
    },
    {
        captions: "That's great! I can't wait to try it out.",
        translation: "Das ist großartig! Ich kann es kaum erwarten, es auszuprobieren.",
        time: "00:00:40",
    },
];

export default function TableDemo() {
    return (
        <Table>
            <TableCaption>A list of your subtitles.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">line</TableHead>
                    <TableHead>captions</TableHead>
                    <TableHead>translation</TableHead>
                    <TableHead className="text-right">time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subtitles.map((subtitle, key) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium">{key + 1}</TableCell>
                        <TableCell>{subtitle.captions}</TableCell>
                        <TableCell>{subtitle.translation}</TableCell>
                        <TableCell className="text-right">{subtitle.time}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} >100</TableCell>
                    <TableCell className="text-right">Total</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
