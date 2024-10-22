import { useEffect } from "react";

export const useOnKeyPress = (callback: any, targetKeys: string[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (targetKeys.includes(event.key)) {
                callback();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [callback, targetKeys]);
};
