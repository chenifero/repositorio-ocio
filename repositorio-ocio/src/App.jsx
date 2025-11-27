import { useState, useEffect } from "react"; // Importamos los hooks necesarios
import './App.css';

// Importamos tus componentes
import Show from './components/Show.jsx';
import Login from './components/Login.jsx'; 

// Importamos la autenticación de Firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // 1. DEFINIMOS LOS ESTADOS (Aquí creamos las variables 'user' y 'loading')
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // 2. EFECTO PARA ESCUCHAR A FIREBASE
  useEffect(() => {
    // Esta función vigila si alguien entra o sale de la app
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUser(usuarioFirebase); // Hay usuario conectado
      } else {
        setUser(null); // No hay nadie
      }
      setLoading(false); // Ya terminamos de cargar, quitamos el loading
    });

    return () => unsubscribe();
  }, []);

  // 3. RENDERIZADO
  if (loading) return <h1>Cargando...</h1>;

  return (
    <>
      {user ? (
        // Si hay usuario, mostramos el repositorio (pasándole el usuario)
        <Show user={user} /> 
      ) : (
        // Si no, mostramos el Login
        <Login />
      )}
    </>
  );
}

export default App;
