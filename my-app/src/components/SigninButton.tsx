"use client"
import { signOut, signIn, useSession } from 'next-auth/react'

const SigninButton = () => {

    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <div className='flex gap-4 ml-auto'>
                <p className="text-sky-600">{session.user.name}</p>

                <button onClick={() => signOut()} className="text-red-600">Sign out</button>
            </div>
        )
    }
    return (
        <button onClick={() => signIn()} className='text-green-600 ml-auto'>Sign in</button>
    )
}

export default SigninButton;
