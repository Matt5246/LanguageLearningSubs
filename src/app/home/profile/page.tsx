"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
export default function UserProfile() {

    const session = useSession();

    if (!session) {
        return <div>You are not logged in.</div>;
    }
    const user = session?.data?.user;

    const { name, email, image } = user || {};

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
            description: `${image ? <Image src={image} alt="Profile Image" width={100} height={100} /> : null}`,
        },
    ];
    console.log(image)
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
                        {Credentials.map((credentials, index) => (
                            <div
                                key={index}
                                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {credentials.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {credentials.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href='/home/profile/subscribe' className="w-full">

                        <Button className="w-full">
                            <CheckIcon className="mr-2 h-4 w-4" /> Subscriptions
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
