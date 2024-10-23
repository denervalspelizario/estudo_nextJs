import { RouterProvider } from 'react-router-dom'
import { router } from './routes' 


function App() {
  

  return (
    // todas as configuracoes de rotas estão em router (verificar router.tsx)
    <RouterProvider router={router} /> 
  )
}

export default App
