import { GetServerSideProps } from "next";
import styles from "./styles.module.css";
import Head from "next/head";

import { getSession } from "next-auth/react";
import { Textarea } from "../../components/textarea";

// icons - npm add react-icons
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

// manipulaçao de estados, form e evento
import { ChangeEvent, FormEvent, useState, useEffect} from "react";

// firebase
// banco
import { db } from "../../services/firebaseConnection"; 

// métodos do firestore
import {
  addDoc,      // Adiciona um novo documento(tabela) no Firestore.
  collection,  // Acessa uma coleção específica no Firestore.
  query,       // Cria uma consulta para buscar docs com filtros e ordenações.
  orderBy,     // Especifica a ordenação dos docs em uma query (por campo e ordem).
  where,       // condições de filtro na consulta (ex: campo igual a um valor específico).
  onSnapshot, // Escuta mudanças em tempo real em docs ou coleções.
  deleteDoc, // deleta dados de um atebla
  doc,       // acesa uma tabela especifica
} from "firebase/firestore";
import Link from "next/link";


// Obs para criar os filtros de busca melhor temque criar o indice
// para poder usar o where de maneira otimizada 
// para fazer isso assita a aula
// https://www.udemy.com/course/nextjs-zero-ao-avancado/learn/lecture/36708840#questions
// no minuto 4  a  5

// tipagem do usuário que vem do getServerSideProps(final da pag)
interface HomeProps {
  user: {
    email: string;
  };
}

// tipagem da tarefa
interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

// Obs esse user vem dogetServerSideProps no final da pagina(olhar)
export default function Dashboard({ user }: HomeProps) {

  // state do input
  const [input, setInput] = useState("");

  // state do checkbox da tarefa publica ou não
  const [publicTask, setPublicTask] = useState(false);

  // state da tarefa tipo TaskProps
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  // será acionada quando tiver uma session(user logado)
  useEffect(() => {

    //
    async function loadTarefas() {


      // usando collection para acessar banco > tabela  'tarefas'
      const tarefasRef = collection(db, "tarefas");

      // criando o filtro da query
      const buscaFiltrada = query(
        
        // será na tabela tarefas
        tarefasRef,
        
        // será ordenada por criação de forma descendente
        orderBy("created", "desc"),
        
        // apenas dados onde o user(email do dono da tarefa) do banco 
        // for igual ao user(email do user) logado(user da session)
        where("user", "==", user?.email)
      );

      // Buscando os dados em real time(OnSnapshot)
      // snapshot terá todos os dados de buscaFiltrada
      onSnapshot(buscaFiltrada, (snapshot) => {

        // criando uma lista tipo aray tipo TaskProps
        let lista = [] as TaskProps[];

        // percorrendo dados de snapshot(valores da buscaFiltrada)
        snapshot.forEach((doc) => {
          // e adicionando esses valores na lista
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        // adicionando os dados de lista(dados de buscaFiltrdada)
        // na state task
        setTasks(lista);
      });
    }

    loadTarefas();

    // quando user tiver email significa que na session ussuárioe sta logado
    // então esse user será logado 
  }, [user?.email]);








  // função que altera o state publictask para false ou true
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  // função de registro de usuário
  async function handleRegisterTask(event: FormEvent) {
    
    event.preventDefault(); // evitando atualização da pag

    // se o input estiver vazio
    if (input === "") return;


    try {
      // adicionado o os dados no banco em uma tabela de tarefas
      // addDoc cria uma tabela no firebase
      await addDoc(collection(db, "tarefas"), {

        // dados da tabela
        tarefa: input, // tarefa
        created: new Date(), // data
        user: user?.email, // email
        public: publicTask, // se ela é publica ou não
      });

      setInput(""); // esvaziando o input

      setPublicTask(false); // zerando o state de public task

      // deu erro
    } catch (err) {
      console.log(err);
    }
  }

  // compia url do navegador para poder compartilhar o link
  async function handleShare(id: string) {

    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert("URL Copiada com sucesso!");
  }

  // deletando a tarefa
  async function handleDeleteTask(id: string) {
    
    // acessadno banco > tabela tarefas> e a tarefa pelo id
    const docRef = doc(db, "tarefas", id);
    
    // deletando a tarefa
    await deleteDoc(docRef);
  }

  return (
    <div className={styles.container}>

      {/* menu*/}
      <Head>
        
        {/* alterando titulo da aba da pagina*/}        
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>

        <section className={styles.content}>

          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            {/* ao clicar no btn do submit chama a função RegisterTask */}
            <form onSubmit={handleRegisterTask}>
             
              {/* Componente Textarea*/}
              <Textarea 
               
                placeholder="Digite qual sua tarefa..." 
                
                value={input} // valor inicial do input
                
                // oque for digitado no input será adicionado no input
                // obs esta tipado com evento  tipo textarea
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
                />
              

              {/* input tipo checkbox */}
              <div className={styles.checkboxArea}>
                
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  
                  // recebdo valor do checkbox e adicionando na state
                  checked={publicTask} 

                  // chamando a função changepublic
                  onChange={handleChangePublic}
                  
                  />
                
                <label>Deixar tarefa publica?</label>
              </div>

              {/* botao do form */}
              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          
          <h1>Minhas tarefas</h1>

        {/* Lista de tarefas que esta na state task */}
          {tasks.map((item) => (
            
            /* Inicio do container onde ficará cada item da lista de tarefas */
            <article key={item.id} className={styles.task}>

            {/* se tarefa for public tera esse mini container com btn de compartilhar*/}
              {item.public && (
                
                <div className={styles.tagContainer}>
                  
                  <label className={styles.tag}>PUBLICO</label>
                  <button 
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}>
                    
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>

                {/* se tarefa for public tera link para ir para tarefa*/}
                {/* Obs como esta feito o link para ir até a tarefa task/id */}
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (

                  // nao sendo public tera apenas um paragrafo indicando
                  <p>{item.tarefa}</p>
                )}

                <button 
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(item.id)}
                  >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}

        </section>
      </main>
    </div>
  );
}

// Aqui dentro será recebido a requisições
//getServerSideProps é uma função especial do Next.js que permite buscar dados no servidor para cada requisição da página.
// Obs ele vai fazer a busca no servidor ANTES de renderizar a pagina
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  
  // pegando os dados da Session
  const session = await getSession({ req });
  
  // se NAO tiver user na session(usuário nao existe)
  if (!session?.user) {
    // redireciona para home
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // se tiver usuário logado retona o email do usuario para uso
  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
