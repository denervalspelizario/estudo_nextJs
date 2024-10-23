import {Link} from 'react-router-dom' // componente react usado para ir para outra pagina



export default function Home(){
  return(
    <div>
      <h1>Bem vindo a pagina Home!!!</h1>
      <span>essa é minha primeira pagina com navegação</span>

      <br />

      <Link to='/sobre'>Sobre</Link>
      <br />
      <Link to='/contato'>Contato</Link>
    </div>
  )
}