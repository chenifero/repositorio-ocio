import { useEffect, useState } from "react";
import Card from "./Card";
import SearchModal from "./SearchModal";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

function Show({ user }) {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [myCollection, setMyCollection] = useState([]); // Estado para almacenar la colección del usuario

  /////////////////FIREBASE//////////////////////////////
  useEffect(() => {
    //Creamos una Query (Consulta)
    // "Dame los documentos de 'items' DONDE el campo 'uid' sea igual al ID de mi usuario"
    const q = query(collection(db, "items"), where("uid", "==", user.uid));

    // Usamos 'q' en lugar de 'collection(db, "items")'
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyCollection(docs);
    });
    return () => unsubscribe();
  }, [user.uid]); // Se ejecuta si cambia el usuario

  //añade en tiempo real los cambios de la colección "items"
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      // Convertimos los documentos de firebase a un array usable
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyCollection(docs);
    });
    // Limpieza cuando se cierra el componente
    return () => unsubscribe();
  }, []);

  //AÑADIR A FIREBASE
  const handleAddToCollection = async (item) => {
    // Validación: miramos si ya existe en el estado actual
    if (myCollection.some((savedItem) => savedItem.Title === item.Title)) {
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
        uid: user.uid, // Asociamos el item al usuario actual
        addedAt: new Date(), // Opcional: fecha de añadido
      });
      setShowModal(false); // Cerramos el modal
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminarlo?")) {
      await deleteDoc(doc(db, "items", id));
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    signOut(auth);
  };

  ////////////////////////////////FIREBASE////////////////////////////////

  return (
    <div className="show-container">
      {/* --- CABECERA EXACTA AL DISEÑO --- */}
      <header className="app-header">
        {/* Bloque Izquierdo: Título + Subtítulo */}
        <div className="brand-block">
          <h1 className="header-logo">S T A S H .</h1>
          <span className="header-subtitle">LO VES. LO AÑADES.</span>
        </div>

        {/* Bloque Derecho: Botón */}
        <button className="logout-btn-header" onClick={handleLogout}>
          CERRAR SESIÓN.
        </button>
      </header>

      {/* --- CONTENIDO --- */}
      <main className="main-content">
        {myCollection.length === 0 ? (
          <div className="empty-state">
            <h2>Tu repositorio está vacío</h2>
            <p>Pulsa el botón + para empezar.</p>
          </div>
        ) : (
          <div className="grid-container">
            {myCollection.map((item) => (
              <div key={item.id} className="card-wrapper">
                {/* Pasamos la función handleDelete DIRECTAMENTE al componente Card */}
                <Card
                  title={item.Title}
                  year={item.Year}
                  posterPath={item.Poster}
                  rating={item.rating}
                  overview={item.overview}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <button className="floating-add-btn" onClick={() => setShowModal(true)}>
        +
      </button>
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
