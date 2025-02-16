import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { fetchAndInitializeSubtitles } from "@/components/NavBar";


interface DeleteWordDrawerProps {
    hardWord: string;
}

const DeleteWord: React.FC<DeleteWordDrawerProps> = ({ hardWord }) => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const email = session?.user?.email

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/hardWords/delete`, { data: { hardWord, email } });

            toast({
                title: "Deleted",
                description: "The word was successfully deleted.",
            });
            fetchAndInitializeSubtitles(email, dispatch);
        } catch (error) {
            console.error('Error deleting word:', error);
            toast({
                title: "Error",
                description: "Failed to delete word.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                className="flex items-center space-x-2 xs:space-x-0"
                onClick={() => setIsDrawerOpen(true)}
            >
                <Trash2 size={21} />
                <span className="hidden sm:inline">Delete word</span>
            </Button>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Delete Hard Word</DrawerTitle>
                            <DrawerDescription>
                                Are you sure you want to delete this word? This action cannot be undone.
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button variant="destructive" onClick={handleDelete}>
                                Confirm Delete
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default DeleteWord;

export const DeleteWordBadge = ({ hardWord }: { hardWord: string }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { toast } = useToast();
    const { data: session, status } = useSession();
    const email = session?.user?.email
    console.log(hardWord);
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/hardWords/delete`, { data: { hardWord, email } });

            toast({
                title: "Deleted",
                description: "The word was successfully deleted.",
            });
        } catch (error) {
            console.error('Error deleting word:', error);
            toast({
                title: "Error",
                description: "Failed to delete word.",
                variant: "destructive",
            });
        }
        setIsDrawerOpen(false);
    };

    return (
        <>
            <DrawerTrigger asChild>
                <Badge
                    variant="destructive"
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center space-x-2 xs:space-x-0"
                >
                    <span className="hidden sm:inline">Delete word</span>
                </Badge>
            </DrawerTrigger>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Delete Hard Word</DrawerTitle>
                            <DrawerDescription>
                                Are you sure you want to delete this word? This action cannot be undone.
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button variant="destructive" onClick={handleDelete}>
                                Confirm Delete
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
};
