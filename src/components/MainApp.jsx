import { useRef } from "react";
import { Header } from "./Header";

export const MainApp = ({currentUser, handleLogout, setCurrentUser, setQuery}) => {

    return (
      <>
       <Header currentUser={currentUser} handleLogout={handleLogout} />
        <h3>Aqui tus series y peliculas por ver</h3>
      </>
        
    );
    }