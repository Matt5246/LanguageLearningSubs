import { useDispatch, useSelector } from "react-redux";
import { toggleAutoScroll } from "@/lib/features/subtitles/subtitleSlice";
import { Button } from "./ui/button";

export function ToggleAutoScrollButton() {
    const dispatch = useDispatch();
    const autoScrollEnabled = useSelector((state: any) => state.subtitle.autoScrollEnabled);

    return (
        <Button
            onClick={() => dispatch(toggleAutoScroll())}
            variant="outline"
        >
            {autoScrollEnabled ? "Disable Auto-Scroll" : "Enable Auto-Scroll"}
        </Button>
    );
}
