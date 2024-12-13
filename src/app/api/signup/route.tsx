
import bcrypt from 'bcrypt'
import prisma from '@/lib/prismadb'

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
        return new Response(
            JSON.stringify({ error: 'Email already exists' }),
            {
                status: 400,
            }
        );

    const [emailPrefix, _domain] = email.split('@');

    if (password.includes(emailPrefix) || password.includes(name)) {
        return new Response(
            JSON.stringify({
                error:
                    'Password can not contain neither username or part of the email',
            }),
            {
                status: 403,
            }
        );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    return new Response(
        JSON.stringify({ message: 'User created successfully' }),
        { status: 201 }
    );
}
