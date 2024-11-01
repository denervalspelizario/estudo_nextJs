import styles from "./styles.module.css";

// imports da autenticação next-auth
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";



export function Header() {
  
  // fazendo a descontrução do hook useSession
  // dentro dele existe o data nele contem session e status
  // que serão usados para checar se user esta logado ou não 
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas<span>+</span>
            </h1>
          </Link>

          {/*Acessando session se tiver user(usuario esta logado)
            então permito acessar ao link Meu Painel*/}
          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        
        </nav>

        {/* se o status for loading */}  
        {status === "loading" ? (

         <></> // aqui poderia colocar um loading algo assim

        ) : session ? ( // se tiver uma session(usuario esta logado)
          
          // botão para deslogar
          <button className={styles.loginButton} onClick={() => signOut()}>
          
            {/* acessando a session que contem os dados do user do gmail
            (nome, email, imagem de profile)*/}
            Olá {session?.user?.name} 
          
          </button>
        
        ) : ( // nao esta em loading nem session (usuario não esta logado)

          // botão para logar
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
