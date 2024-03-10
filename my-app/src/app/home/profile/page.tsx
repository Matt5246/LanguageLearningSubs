"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";

export default function UserProfile() {

    const session = useSession();

    console.log(session)
    if (!session) {
        return <div>You are not logged in.</div>;
    }
    const user = session?.data?.user;

    const { name, email, image } = user || {};

    // Credentials data
    const Credentials = [
        {
            title: "your username credentials.",
            description: `${name}`,
        },
        {
            title: "Your email.",
            description: `${email}`,
        },
        {
            title: "Your profile image.",
            description: `${image}`,
        },
    ];

    return (
        <div className="flex justify-center mt-6">
            <Card className={cn("</div>w-[380px]")}>
                <CardHeader>
                    <CardTitle>{name ? (name + ' Profile') : "Your Profile"}</CardTitle>
                    <CardDescription>Here you can check your details.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <BellIcon />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Mute Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Silent mode notifications.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div>
                        {Credentials.map((notification, index) => (
                            <div
                                key={index}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <CheckIcon className="mr-2 h-4 w-4" /> Make changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
