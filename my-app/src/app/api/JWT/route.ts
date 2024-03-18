import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req: NextRequest, res: any) {
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    // const token = await getToken({ req })
    const token = await getToken({ req, secret })
    console.log("JSON Web Token", token)
    res.end()
}