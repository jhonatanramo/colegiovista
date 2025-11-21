// GlobalContext.jsx
import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({});

  return (
    <GlobalContext.Provider value={{ usuario, setUsuario}}>
      {children}
    </GlobalContext.Provider>
  );
};
