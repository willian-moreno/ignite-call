import { queryClient } from '@/lib/auth/react-query'
import { globalStyles } from '@/styles/global'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://github.com/willian-moreno/ignite-call',
            siteName: 'Ignite Call',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
