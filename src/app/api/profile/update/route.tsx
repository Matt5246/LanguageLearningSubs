
import bcrypt from 'bcrypt'
import prisma from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest | Request) {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name) {
        return new NextResponse("Missing name or password", { status: 400 })
    }
    const data: { name: string; hashedPassword?: string } = {
        name
    }
    if (password) {
        data.hashedPassword = await bcrypt.hash(password, 10);
    }
    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });
    console.log(data)
    const user = await prisma.user.update({
        where: {
            id: exist?.id,
        },
        data,
    });

    return NextResponse.json(user)
}