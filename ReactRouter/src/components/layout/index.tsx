import {Outlet} from 'react-router-dom'
import Header from '../header'

/*
  O Outlet é um componente do React Router v6 que é usado para renderizar o conteúdo de rotas aninhadas. 
  Ele é usado como um componente filho de uma rota pai e renderiza o conteúdo da rota pai e filho. 
  Você pode usar o Outlet para renderizar o conteúdo de rotas aninhadas em um único lugar1.
*/


export default function Layout(){
  return(
    <>
    <Header /> {/* header vai aparecer em todas as pagina pois esta acima */}
    <Outlet /> {/* e outlet renderiza todo o resto (olhar em router.tsx) */}
    <br />
    <br />
    <footer>
      <span>Todos os direitos reservados @2024</span>  
    </footer>  
    </>
  )
}