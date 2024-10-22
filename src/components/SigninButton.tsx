"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from "next/link"
const SigninButton = () => {

    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className='flex gap-4 ml-auto font-bold'>
                {session?.user?.name}

                <button onClick={() => signOut()} className="text-red-600">Sign out</button>
            </div>
        )
    }
    return (
        <button className='text-green-600 ml-auto'><Link href="/auth">Sign in</Link></button>

    )
}

export default SigninButton;
