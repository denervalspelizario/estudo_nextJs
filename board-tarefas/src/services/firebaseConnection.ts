import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALq5EN1JGisFVM4JO4gUKe_j1lPVNkwFo",
  authDomain: "board-tarefas-next.firebaseapp.com",
  projectId: "board-tarefas-next",
  storageBucket: "board-tarefas-next.appspot.com",
  messagingSenderId: "82794813534",
  appId: "1:82794813534:web:078ef5e96a349bea1cbccf"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };



