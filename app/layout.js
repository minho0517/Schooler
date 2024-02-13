import './globals.css';

import Providers from '@/utils/provider';
import LoadingProviders from '@/components/Provider/loading-provider';
import Layout from '@/components/Layout/Layout';
import { SocketProvider } from '@/components/Provider/socket-provider';
import AuthSession from '@/components/Provider/auth-provider';

export const metadata = { 
  title: '스쿨러',
  description: '청소년을 위한 플랫폼',
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
