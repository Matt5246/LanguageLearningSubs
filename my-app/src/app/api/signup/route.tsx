
import bcrypt from 'bcrypt'
import prisma from '../../../lib/prismadb'
import { NextResponse } from 'next/server'

export interface SignupRequestBody {
    name: string;
    email: string;
    password: string;
}

export async function POST(req: { json: () => Promise<SignupRequestBody> }) {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
        return new NextResponse("Missing name, email or password", { status: 400 })
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (exist) {
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    });

    return NextResponse.json(user)
}