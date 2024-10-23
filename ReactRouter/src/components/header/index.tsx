import { Link } from 'react-router-dom';
import './header.css'

export default function Header(){
  return(
    <header>
      <h1>DSPelizario Desenvolvedor</h1>


      <div>
        <Link to='/'>Home</Link>
        <Link to='/sobre'>Sobre</Link>
        <Link to='/contato'>Contato</Link>
      </div>
    </header>
  )
}