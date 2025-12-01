import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
    
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">S T A S H.</h1>
            <p className="login-subtitle">Guarda tus películas, series y juegos favoritos.</p>
            <button className="login-btn" onClick={handleGoogleLogin}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/104/104093.png" 
                    alt="Google Logo" 
                    className="google-icon"
                    width="20" // Un tamaño base pequeño para el icono
                />
                ENTRAR CON GOOGLE
            </button>
        </div>
    );
}

export default Login;