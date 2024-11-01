import { HTMLProps } from "react";
import styles from "./styles.module.css";

// ... rest(tudo que o componente vai receber de props)
// vai ser tipo HtmlProps<HHTMLTextAreaElement> 
//HTMLProps<HTMLTextAreaElement> garante que o componente Textarea aceite apenas propriedades HTML válidas para um elemento <textarea>, melhorando a tipagem, o autocompletar e a documentação do componente.
export function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {

  return <textarea 
    className={styles.textarea} 
    {...rest}
    > 
    </textarea>;

}
