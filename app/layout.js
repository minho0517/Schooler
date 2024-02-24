import './globals.css';

import Providers from '@/utils/provider';
import LoadingProviders from '@/components/Provider/loading-provider';
import Layout from '@/components/Layout/Layout';
import { SocketProvider } from '@/components/Provider/socket-provider';
import AuthSession from '@/components/Provider/auth-provider';

export const metadata = { 
  title: '스쿨러 - 우리들만의 커뮤니케이션',
  description: '청소년을 위한 플랫폼',
  icons: {
    icon: "./image/schooler-logo-icon.png",
  },
}

export default async function RootLayout({ children }) {

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link rel="manifest" href="/manifest.json" />
        <meta name='theme-color' />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width" />
        <meta name="google-site-verification" content="prJR6Uu3G2AAOd2mj5RtiK2z5MFsyXhRT8dT1yhK444" />
        <meta name="naver-site-verification" content="c0ecc2397cb5e71fbfda6de23e0059150d1ad38a" />
        <link rel="stylesheet" type="text/css" href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'></link>
        <link href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Gugi&family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Sunflower:wght@300;500;700&display=swap" rel="stylesheet"></link>  
      </head>
      <body>
        <AuthSession>
          <Providers>
            <LoadingProviders>
              <SocketProvider>
                <Layout>
                  {children}
                </Layout>
                <div id="portal"></div>
              </SocketProvider>
            </LoadingProviders>
          </Providers>
        </AuthSession>
      </body>
    </html>
  )
}
