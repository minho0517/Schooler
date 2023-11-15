import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(request) {

    const session = await getToken({req : request});

    if (session === null) {
        return NextResponse.redirect(process.env.ABSOLUTE_URL + "/auth/login")
    } else {
        return NextResponse.rewrite(process.env.ABSOLUTE_URL + request.nextUrl.pathname)
    }

}

export const config = {
    matcher : [
    '/post/:path*', 
    '/share', 
    '/edit/:path*', 
    '/profile/:path*', 
    '/sharing/:path*',
    '/livechat/:path*',
    '/school/:path*',
    '/my_activity/:path*'
    ]
}