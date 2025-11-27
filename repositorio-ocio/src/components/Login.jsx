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
            <h1 className="login-title">🍿 Mi Repositorio</h1>
            <p className="login-subtitle">Guarda tus películas, series y juegos favoritos.</p>
            
            <button className="login-btn" onClick={handleGoogleLogin}>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                    alt="Google Logo" 
                    className="google-icon"
                    width="20" // Un tamaño base pequeño para el icono
                />
                Entrar con Google
            </button>
        </div>
    );
}

export default Login;