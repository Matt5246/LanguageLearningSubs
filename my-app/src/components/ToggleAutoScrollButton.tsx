'use client'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toggleAutoScroll } from "@/lib/features/subtitles/subtitleSlice";
import { Button } from "./ui/button";

export function ToggleAutoScrollButton() {
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const autoScrollEnabled = useSelector((state: any) => state.subtitle.autoScrollEnabled);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Button
            onClick={() => dispatch(toggleAutoScroll())}
            variant="outline"
        >
            {autoScrollEnabled ? "Disable Auto-Scroll" : "Enable Auto-Scroll"}
        </Button>
    );
}
