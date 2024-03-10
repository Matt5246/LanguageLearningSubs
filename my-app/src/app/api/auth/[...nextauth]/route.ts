import NextAuth, { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../../../../lib/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"

const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "John" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Gone" },
            },

            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('No user found')
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }

                return user;
            }
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV == "development"

}
//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

