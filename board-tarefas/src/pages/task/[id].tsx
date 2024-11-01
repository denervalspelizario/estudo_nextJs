import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "./styles.module.css";


// firebase
import { db } from "../../services/firebaseConnection";

// metodos do firebase para fazer o crud
import { doc, collection, query, where, getDoc, addDoc, getDocs, deleteDoc } from "firebase/firestore";

// componente criado de textarea
import { Textarea } from "@/src/components/textarea";

// hooks do react
import { ChangeEvent, FormEvent, useState } from "react";

// usessession para acessar os dados do usuario logado
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";

// Obs como esta feito o nome do arquivo e pq [id] nome dinamico
// pasta taks> arquivo [id]tsx = rota http://localhost:3000/task/id-da-tarefa


// tipagem da tarefa recebida do getServerSideProps abaixo
interface TaskProps {
  // dados da tarefa
  item: { 
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  // comentários da tarefa
  allComments: CommentProps[]
}

// objeto que vai tipar o comentario vindo do banco e usado no getServerSideProps
interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}


export default function Task({ item, allComments }: TaskProps) {

  // acessando os dados do user logado e jogando em data
  const { data: session } = useSession();

  // state do input
  const [input, setInput] = useState("");

  // state do comentarios que se incia com todos os comentários 
  // que forma buscados OU vazio caso nao haja nenhum
  // lembrando que a state é tipo CommentProps
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);


  // função que pega os dados do input textarea
  // e com ele cria um objeto que será enviado para
  // a tabela comments no banco de dados linkada ao id
  // da tarefa do usuario
  async function handleComment(event: FormEvent) {

    // evitando a atualizacao da pagina ao clicar no  btn do form
    event.preventDefault();

    // validações
    if (input === "") return;

    if (!session?.user?.email || !session?.user?.name) return;

    // criando a tabela comments no banco de dados(db)
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input, // valor digitado no input
        created: new Date(), // data da criação
        user: session?.user?.email, // email do usuário pego pela session
        name: session?.user?.name, // nome do usuario pego pela session
        taskId: item?.taskId, // anexando o id da tarefa com o comentario
      });

      // objeto com as informações session e comentarios
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      // atualizando a state comments com os dados que ja exitem(oldItems) 
      // e adicionando além os dados novos ( data ) ou seja dados antigos mais os novos
      setComments((oldItems) => [...oldItems, data]);

      setInput(""); // limpando o input

    } catch (err) { // deu erro

      console.log(err); // imprime o erro
    }
  }


  // função para delete de comentario
  // recebe o id do comentario
  async function handleDeleteComment(id: string) {

    try {
      // buscando no banco na tabela id
      const docRef = doc(db, "comments", id);
      // se ele existe usando o metodo do firebase deleta ele
      await deleteDoc(docRef);

      // depois de deletado busco novamente todos os comentarios da tarefa
      // via id e adiciono na const 
      const deletComment = comments.filter((item) => item.id !== id);

      // altero a state que recebe todos os comentarios ja atualizado
      // sem aquele comentário especifico que foi deletado
      setComments(deletComment);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefa - Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        
        <h1>Tarefa</h1>
          
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      
      </main>


      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>

        {/* Area do formulario com input para digitar comentario  */}
        {/* ao clicar eme nviar chama a função handleComment  */}
        <form onSubmit={handleComment}>
          <Textarea 
            placeholder="Digite seu comentário..."
            value={input}
            // pegando dado(value) digitado no input e jogando na state input
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            
            />
          <button
            className={styles.button}
            // se nao esta logado(session  vazia) teatarea fica desabilitado 
            disabled={!session?.user} 
            >Enviar comentário</button>
        </form>
      </section>


      {/* State com os comentário recuperados */}      
      <section className={styles.commentsContainer}>

        <h2>Todos comentários</h2>
        
        {/* Não tendo nenhum comentário */} 
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {/* mostrando todos os comentarios se houverem */} 
        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>

          {/* mostrando nome do dono do comentario */}
          <div className={styles.headComment}>
            <label className={styles.commentsLabel}>{item.name}</label>
          

          {/* validação, se email do comentário user do comentario
              for igual ao emaio do user logado vai aparecer o btn de excluir */}
          {item.user === session?.user?.email && (

            /* btn para excluir o btn */
            <button
              className={styles.buttonTrash}
                onClick={() => handleDeleteComment(item.id)}
              >
                <FaTrash size={18} color="#EA3140" />
              </button>
            )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>      


    </div>
  );
}



// antes de inicializar a pagina acessar o servidor antes com getServerSideProps
// params = dados recebidos do servidor
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
 
  // pegando o id e tipando como string
  const id = params?.id as string;

  // acessando o banco > tabela tarefas > tarefa especifica pelo id
  const docRef = doc(db, "tarefas", id);


  // buscando o comentário no banco da tabela comments onde taskid(id) seja igual id(id da tarefa)
  const busca = query(collection(db, "comments"), where("taskId", "==", id));
  
  const snapshotComments = await getDocs(busca);

  // criando um objeto vazio tipo CommentProps que vai receber os dados do banco(os comentários)
  let allComments: CommentProps[] = [];
  
  // pegando todos os comentarios que estao no snapshotComments
  // e adicionando no objeto allComments
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });


  // monitorando essa tarefa em real time
  const snapshot = await getDoc(docRef);

  // se nao achou tarefa vou para home
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // se ela NAO for public volta para home 
  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // formatando a data de criação(created) que esta em Timestamp 
  // transformo em milisegundos para depois tranformar em string
  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  // criando um objeto chamado task que vai receber os dados da tarefa
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(), // formatando a data
    user: snapshot.data()?.user,
    taskId: id,
  };

  console.log(task);

  return {
    props: {
      // retorna os dados da tarefa que estão na state task
      item: task, 
      // retorna todos os comentarios de um id especifico(id da tarefa)
      allComments: allComments,
    },
  };
};
