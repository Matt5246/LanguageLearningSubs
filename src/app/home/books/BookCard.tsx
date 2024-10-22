import React from 'react';
import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type BookProps = {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
};

const CardDemo = ({ title, author, description, imageUrl }: BookProps) => {
    return (
        <Card className='w-80 m-3'>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <img src={imageUrl} alt={title} className="w-full h-auto" />
                <p>{author}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <CheckIcon className="mr-2 h-4 w-4" /> Open
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CardDemo;
