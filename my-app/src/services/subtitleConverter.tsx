export default function SubsEditor(fileString: string, selectedOption: string) {
    if (selectedOption === "yt") {
        console.log("yt");
        // Remove unwanted characters
        fileString = fileString.replace(/\[Musik\]/g, ""); // remove "[Musik]"
        fileString = fileString.replace(/\[Applaus\]/g, ""); // remove "[Applaus]"

        // Split text into lines and process them
        const lines = fileString.split("\n");
        const timeRegex = /^\d{1,2}:\d{2}:\d{2}\s*$/;
        const timeRegex2 = /^\d{1,2}:\d{2}\s*$/; // regular expression to match time format "h:mm:ss"
        let subsArray = [];
        let id = 0;
        for (let i = 0; i < lines.length; i++) {
            const line1 = lines[i].trim();
            const line2 = lines[i + 1]?.trim();
            if (timeRegex.test(line1) || timeRegex2.test(line1)) {
                const time =
                    timeRegex.test(line1) || timeRegex2.test(line1) ? line1.trim() : "";

                if (line2) {
                    // check if line2 is not empty
                    id++;
                    const subsObject = {
                        id: "line-" + id,
                        learned: false,
                        hard: false,
                        time: time,
                        line: line2,
                    };
                    subsArray.push(subsObject);
                }
            }
        }
        return subsArray;
    } else if (selectedOption === "srt") {
        const lines = fileString.split("\n");
        const subsArray = [];
        let id = "";
        let start = 0;
        let end = 0;
        let subtitle = "";

        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i].trim();

            if (currentLine !== "") {
                if (!isNaN(Number(currentLine))) {
                    // Parse the subtitle ID
                    id = currentLine;
                } else if (currentLine.includes(" --> ")) {
                    // Parse the timestamp line
                    const [startTime, endTime] = currentLine.split(" --> ");
                    start = convertTimeToMilliseconds(startTime);
                    end = convertTimeToMilliseconds(endTime);
                } else {
                    // Accumulate the subtitle text
                    subtitle += currentLine + " ";
                }
            } else if (id !== "" && start !== 0 && subtitle !== "") {
                // Empty line indicates the end of a subtitle
                const dur = (end - start) / 1000; // Calculate duration in seconds
                const subsObject = {
                    start: start / 1000,
                    dur: dur,
                    text: subtitle.trim(),
                };
                subsArray.push(subsObject);

                // Reset the variables for the next subtitle
                id = "";
                start = 0;
                end = 0;
                subtitle = "";
            }
        }

        return subsArray;
    } else if (selectedOption === "ass") {
        // const lines = fileString.split("\n");
        // const subsArray = [];


        // return subsArray;
    }
    return [];
}
function convertTimeToMilliseconds(time: string): number {
    const [hhmmss, ms] = time.split(",");
    const [hh, mm, ss] = hhmmss.split(":").map(Number);
    return ((hh * 3600 + mm * 60 + ss) * 1000) + Number(ms);
}