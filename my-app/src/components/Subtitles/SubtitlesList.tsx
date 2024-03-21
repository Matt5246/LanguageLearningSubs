'use client'
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


export default function SubtitlesList({ captions }: { captions: Caption[] }) {
    return (
        <div className="overflow-auto h-full">
            {captions && captions.length > 0 ? (
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
                        {captions.map((subtitle, key) => (
                            <TableRow key={key}>
                                <TableCell className="font-medium">{key + 1}</TableCell>
                                <TableCell>{subtitle.text}</TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-right">{convertTime(subtitle.offset)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>{captions.length}</TableCell>
                            <TableCell className="text-right">Total</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            ) : (
                <p className="flex justify-center items-center h-full">No captions available.</p>
            )}
        </div>
    );
}
function convertTime(time: number): string {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}