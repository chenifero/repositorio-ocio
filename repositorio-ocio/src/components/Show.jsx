import { useEffect,useState } from "react";
import Card from "./Card";
import SearchModal from "./SearchModal";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";


function Show() {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [myCollection, setMyCollection] = useState([]); // Estado para almacenar la colección del usuario
   
    /////////////////FIREBASE//////////////////////////////
    //añade en tiempo real los cambios de la colección "items"
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
            // Convertimos los documentos de firebase a un array usable
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyCollection(docs);
        });
        // Limpieza cuando se cierra el componente
        return () => unsubscribe();
    }, []);

    //AÑADIR A FIREBASE
    const handleAddToCollection = async (item) => {
        // Validación: miramos si ya existe en el estado actual
        if (myCollection.some(savedItem => savedItem.Title === item.Title)) {
            alert(`¡${item.Title} ya está en tu colección!`);
            return;
        }

        try {
            // Guardamos en la colección "items"
            await addDoc(collection(db, "items"), {
                Title: item.Title,
                Year: item.Year,
                Poster: item.Poster,
                rating: item.rating,
                overview: item.overview,
                addedAt: new Date() // Opcional: fecha de añadido
            });
            setShowModal(false); // Cerramos el modal
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar.");
        }
    };

    //BORRAR DE FIREBASE
    const handleDelete = async (id) => {
        const confirmDelete = confirm("¿Seguro que quieres eliminarlo?");
        if (confirmDelete) {
            try {
                // Borramos el documento por su ID
                await deleteDoc(doc(db, "items", id));
            } catch (error) {
                console.error("Error al borrar:", error);
            }
        }
    };
    ////////////////////////////////FIREBASE////////////////////////////////

  return (
        <div className="show-container">
            <h1 className="main-title">Mi Repositorio</h1>

            {/* CONDICIONAL: Si no hay items, muestra mensaje de bienvenida */}
            {myCollection.length === 0 ? (
                <div className="empty-state">
                    <h2>Tu repositorio está vacío</h2>
                    <p>Pulsa el botón + para añadir contenido.</p>
                </div>
            ) : (
                /* Si hay items, muestra el Grid */
                <div className="grid-container">
                    {myCollection.map((item) => (
                        <div key={item.id} className="card-wrapper">
                            <Card
                                title={item.Title}
                                year={item.Year}
                                posterPath={item.Poster}
                                rating={item.rating}
                                overview={item.overview}
                            />
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(item.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* BOTÓN (+) */}
            <button 
                className="floating-add-btn"
                onClick={() => setShowModal(true)}
            >
                +
            </button>

            {/* MODAL DE BÚSQUEDA (Solo se ve si showModal es true) */}
            {showModal && (
                <SearchModal 
                    onClose={() => setShowModal(false)} 
                    onAdd={handleAddToCollection} 
                />
            )}
        </div>
    );
}

export default Show;