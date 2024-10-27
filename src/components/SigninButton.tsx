"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SigninButton = () => {

    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <DropdownMenuItem className='flex gap-4 ml-auto font-bold cursor-pointer' onClick={() => signOut()}>
                {session?.user?.name}

                <p className="text-red-600">Sign out</p>
            </DropdownMenuItem>
        )
    }
    return (
        <Link href="/auth"><DropdownMenuItem className='text-green-600 cursor-pointer'>Sign in</DropdownMenuItem></Link>

    )
}

export default SigninButton;
