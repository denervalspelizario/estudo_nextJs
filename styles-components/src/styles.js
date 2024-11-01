import styled from 'styled-components';

/*Estilizando a tag Container que é funciona como div*/
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 500px;
`;

/*Estilizando a tag Head que é funciona como header*/
export const Head = styled.header`
width: 100%;
height: 70px;
background-color: brown;
display: flex;
align-items: center;
justify-content: center;
`;

/*Estilizando a tag Titulo que é funciona como link a*/
export const Titulo = styled.a`
font-size: 25px;
color: #00FF00;
`;

export const BemVindo = styled.h1`

// Passando tamanho e cor via props
font-size: ${props => `${props.tamanho}px`};
color: ${props => `#${props.cor}`};
`;

/*
.header{
  width: 100%;
  height: 70px;
  background-color: brown; 
  justify-content: center;
  align-items: center;
  display: flex;
}

.titulo{
  font-size: 35px;
  color: #FFF;
}
*/