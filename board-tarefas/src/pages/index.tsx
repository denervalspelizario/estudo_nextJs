import Head from "next/head";
import styles from "../../styles/home.module.css";
import Image from "next/image";

import heroImg from "../assets/hero.png";


import { GetStaticProps } from "next";
// imports do db
import { db } from "../services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";

// tipagem do parametro recebido dos dados do getStaticProps
interface HomeProps {
  posts: number;
  comments: number;
}


export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tarefas+"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e terefas
        </h1>

        {/* sessão dos posts e comentarios */}
        <div className={styles.infoContent}>

          <section className={styles.box}>  
            {/* valor posts recebido do  getStaticProps*/}
            <span>+{posts} posts</span> 
          </section>
          
          <section className={styles.box}> 
            {/* valor comentários recebido do  getStaticProps*/}
            <span>+{comments} comentários</span> 
          </section>
        </div>
      </main>
    </div>
  );
}


// acessando o servidor ANTES de renderizar a pagina
// mas ao invés de usar o getServerSideProps vamos usar o GetStaticProps
/*
Em Next.js, `getServerSideProps` e `getStaticProps` são funções para buscar dados, mas com abordagens e finalidades diferentes:

- **getServerSideProps**:
  - Executa **no servidor a cada requisição**.
  - Ideal para dados que precisam estar sempre atualizados.
  - O conteúdo é gerado dinamicamente em tempo real.

- **getStaticProps**:
  - Executa **apenas uma vez na build** e gera páginas estáticas.
  - Ideal para conteúdo que não muda com frequência (como blogs ou documentações).
  - É mais rápido, pois não requer processamento em cada requisição.

Use `getServerSideProps` para dados dinâmicos e `getStaticProps` para dados mais estáticos.

*/
export const getStaticProps: GetStaticProps = async () => {

  // acessando a tabela comments do db
  const commentRef = collection(db, "comments");

  // acessando a tabela tarefas do db
  const postRef = collection(db, "tarefas");

  // monitorando as tabelas se caso elas atualizem os dados
  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  // retorno da função
  return {
    props: {
      posts: postSnapshot.size || 0, // tamanho da quantidade de post OU 
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60, // seria revalidada a cada 60 segundos
  };
};