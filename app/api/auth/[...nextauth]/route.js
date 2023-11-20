import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/config/db";
import User from "@/config/schema/User";

export const authOptions = {
    providers : [
        CredentialsProvider({
            name: "Credentials",

            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({id : credentials.id})
                if (!user) {
                    return null;
                }
                const pwcheck = await bcrypt.compare(credentials.password, user.password);
                if (!pwcheck) {
                    return null;
                }
                return user;
            }
        })
    ],
    
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 //30일
    },

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = {};
                token.user.id = user._id
                token.user.role = user.role
                token.user.userId = user.id
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user;  
            return session;
        },
    },      

    secret : process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }