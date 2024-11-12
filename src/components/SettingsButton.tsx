import * as React from "react";
import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";

interface GearButtonProps {
    onClick?: () => void;
    className?: string;
}

export const GearButton: React.FC<GearButtonProps> = ({ onClick, className }) => {
    return (
        <Button variant="secondary" className={`p-2 group ${className}`} onClick={onClick}>
            <GearIcon className="w-5 h-5 transition-transform duration-1000 group-hover:rotate-180" />
        </Button>
    );
};
