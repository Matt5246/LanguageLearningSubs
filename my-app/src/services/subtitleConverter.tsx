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
                    dur: end / 1000,
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
        const lines = fileString.split("\n");
        const subsArray = [];
        const dialoguePrefix = "Dialogue: ";

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith(dialoguePrefix)) {
                const dialogueContent = line.slice(dialoguePrefix.length).split(",");
                if (dialogueContent[3] === "Signs") {
                    continue;
                }

                const startTime = convertAssTimeToSeconds(dialogueContent[1]);
                const endTime = convertAssTimeToSeconds(dialogueContent[2]);
                let text = dialogueContent.slice(9).join(",");
                text = text.replace(/{[^}]*}/g, "").trim();

                const dur = endTime - startTime;
                if (text.length > 0) {
                    const subsObject = {
                        start: startTime / 1000,
                        dur: endTime / 1000,
                        text: text,
                    };
                    subsArray.push(subsObject);
                }
            }
        }
        return subsArray;
    }
    return [];
}
function convertTimeToMilliseconds(time: string): number {
    const [hhmmss, ms] = time.split(",");
    const [hh, mm, ss] = hhmmss.split(":").map(Number);
    return ((hh * 3600 + mm * 60 + ss) * 1000) + Number(ms);
}

function convertAssTimeToSeconds(time: string): number {
    const [h, m, s] = time.split(":");
    const [seconds, centiseconds] = s.split(".");
    return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(seconds) + parseInt(centiseconds) / 100;
}
