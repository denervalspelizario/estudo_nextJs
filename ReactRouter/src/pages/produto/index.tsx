import {Link, useParams} from 'react-router-dom' // LInk componente react usado para ir para outra pagina

/*
  O useParams é utilizado para obter os parâmetros passados em uma determinada rota. 
  Quando você define uma rota com um parâmetro dinâmico, como por exemplo "/users/:id", 
  o useParams permite que você acesse o valor desse parâmetro na página correspondente.
  Por exemplo, se a rota atual for "/users/123", você pode usar o useParams para obter o valor "123". 
  Isso é útil quando você precisa usar esses valores de parâmetros para realizar alguma lógica na sua aplicação, 
  como buscar dados específicos de um usuário com base no ID.
*/

export default function Produto(){

  const { id } = useParams();

  return(
    <div>
      <h1>Bem vindo ao produto {id}</h1>
      <Link to='/'>ir para Home</Link>
    </div>
  )
}