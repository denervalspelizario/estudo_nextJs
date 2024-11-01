import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { Header } from "../components/header";

// biblioteca de autenticação
import { SessionProvider } from "next-auth/react"; 

export default function App({ Component, pageProps }: AppProps) {
  return (

    // Observe que Session(next-auth) ela envelopa todas as rotas
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
