

import  { useEffect, useState } from 'react';
import './App.css';


// Api que será consumida
//https://sujeitoprogramador.com/rn-api/?api=posts



function App() {
  
  // state tipo array que será recebera os dados da api
  const [nutri, setNutri] = useState([]);

  // hook usado parecido ao ngOnit do angular
  // ao inciar a aplicação ...
  useEffect(()=> {

    function loadApi(){
      
      // variavel que recebe a api
      let url = 'https://sujeitoprogramador.com/rn-api/?api=posts';

      fetch(url) // fecth api de navegador para realizacao manipulações http
      .then( // deu certo? os dados vieram..
        (resultado) => resultado.json() // transforma em json
      )
      .then((json)=> { // deu certo? tranformou em json
        
        console.log(json); // imprime
        
        setNutri(json); // joga na state os dados da api traformado em json
      
      })

    }

    loadApi(); // chamando a função

  }, []); // [] = isso indica que será inciado ao iniciar a aplicação 
  
  return (
    <div className="container">
      <header>
        <strong>React Nutri</strong>
      </header>

      {/* Percorrendo todos os dados da state nutri */}
      {nutri.map((item)=>{
        return(
          <article key={item.id} className="post">
            <strong className="titulo">{item.titulo}</strong>

            <img src={item.capa} alt={item.titulo} className="capa" />
            <p className="subtitulo">
              {item.subtitulo}
            </p>
            <a className="botao">Acessar</a>
          </article>
        )
      })}
    </div>
  );
}

export default App;