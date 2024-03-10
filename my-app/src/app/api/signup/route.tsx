
import bcrypt from 'bcrypt'
import prisma from '../../../lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest | Request) {
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