
// tem que instalar o react-router-dom 
// comando npm install react-router-dom
import { createBrowserRouter } from "react-router-dom";

import Home from './pages/home'
import Sobre from './pages/sobre'
import Contato from './pages/contato'
import Produto from './pages/produto'
import NotFound from './pages/notfound'
import Layout from './components/layout'




// Rotas
export const router = createBrowserRouter([
  {
    // o layout é o pai que renderiza todas as rotas filhas (olhar component Layout)
    element: <Layout/>,  
    // rotas filhas
    children: [   
      {
        // caminho
        path: '/', 
        // arquivo que será rederizado no caminho
        element: <Home/>  
      },
      {
        path: '/sobre',
        element: <Sobre/>
      },
      {
        path: '/contato',
        element: <Contato/>
      },
      {
        // rota dinamica de acordo com id
        path: '/produto/:id', 
        // rederizar o produto 
        element: <Produto/>    
      },
      {
        // rota de erro, Obs sempre deve ser a ultima rota
        path: "*",                  
        element: <NotFound/>
      },
    
    ]
  }
])