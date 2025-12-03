import { useEffect, useState } from "react";
import Card from "./Card";
import SearchModal from "./SearchModal";
import DetailModal from "./DetailModal"; // Importamos el modal de detalle
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { FaSearch } from "react-icons/fa"; // Importamos la lupa para la barra de filtro

function Show({ user }) {
  // --- ESTADOS ---
  const [showModal, setShowModal] = useState(false); // Modal para añadir
  const [selectedItem, setSelectedItem] = useState(null); // Modal de detalle (item seleccionado)
  const [myCollection, setMyCollection] = useState([]); // Datos de Firebase
  
  // Estados de los filtros
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  // --- 1. LEER DE FIREBASE EN TIEMPO REAL ---
  useEffect(() => {
    if (!user || !user.uid) return;
    
    // Consulta: Solo items del usuario logueado
    const q = query(collection(db, "items"), where("uid", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyCollection(docs);
    });
    
    return () => unsubscribe();
  }, [user]);

  // --- 2. AÑADIR NUEVO ITEM ---
  const handleAddToCollection = async (item) => {
    // Evitar duplicados por título
    if (myCollection.some((savedItem) => savedItem.Title === item.Title)) {
      alert(`¡${item.Title} ya está en tu colección!`);
      return;
    }
    
    try {
      await addDoc(collection(db, "items"), {
        ...item, // Copia todas las props que vienen de getData (Title, Poster, type, etc.)
        uid: user.uid,
        status: 'pending', // Por defecto se añade como pendiente
        addedAt: new Date(),
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // --- 3. CAMBIAR ESTADO (VISTO / PENDIENTE) ---
  const toggleStatus = async (id, currentStatus) => {
      const newStatus = currentStatus === 'watched' ? 'pending' : 'watched';
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, {
          status: newStatus
      });
  };

  // --- 4. BORRAR ITEM ---
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminarlo?")) {
      await deleteDoc(doc(db, "items", id));
      // Si el item borrado estaba abierto en el modal, lo cerramos
      if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null);
      }
    }
  };

  // --- 5. CERRAR SESIÓN ---
  const handleLogout = () => {
    signOut(auth);
  };

  // --- 6. LÓGICA DE FILTRADO ---
  const filteredCollection = myCollection.filter(item => {
      // Filtro 1: Tipo (Peli, Serie, Juego)
      const matchesType = typeFilter === 'all' ? true : item.type === typeFilter;
      
      // Filtro 2: Estado (Visto, Pendiente) - Si no tiene status, asumimos 'pending'
      const itemStatus = item.status || 'pending'; 
      const matchesStatus = statusFilter === 'all' ? true : itemStatus === statusFilter;
      
      // Filtro 3: Búsqueda de texto (Título)
      const matchesSearch = item.Title.toLowerCase().includes(filterSearch.toLowerCase());

      // Tienen que cumplirse las 3 condiciones
      return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="show-container">
      
      {/* --- HEADER --- */}
      <header className="app-header">
        <div className="brand-block">
          <h1 className="header-logo">S T A S H .</h1>
          <span className="header-subtitle">LO VES. LO AÑADES.</span>
        </div>
        <button className="logout-btn-header" onClick={handleLogout}>
          CERRAR SESIÓN.
        </button>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="main-content">
        
        {/* Solo mostramos los filtros si el usuario tiene algo guardado */}
        {myCollection.length > 0 && (
            <>
                {/* BARRA DE BÚSQUEDA RÁPIDA */}
                <div className="quick-search-container">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Buscar en tu colección..." 
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            className="quick-search-input"
                        />
                    </div>
                </div>

                {/* BOTONES DE FILTRO */}
                <div className="filters-wrapper">
                    {/* IZQUIERDA: Tipos */}
                    <div className="filter-group">
                        <button className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>Todos</button>
                        <button className={`filter-btn ${typeFilter === 'movie' ? 'active' : ''}`} onClick={() => setTypeFilter('movie')}>Películas</button>
                        <button className={`filter-btn ${typeFilter === 'series' ? 'active' : ''}`} onClick={() => setTypeFilter('series')}>Series</button>
                        <button className={`filter-btn ${typeFilter === 'game' ? 'active' : ''}`} onClick={() => setTypeFilter('game')}>Juegos</button>
                    </div>

                    {/* DERECHA: Estado */}
                    <div className="filter-group">
                        <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>Todo</button>
                        <button className={`filter-btn ${statusFilter === 'watched' ? 'active' : ''}`} onClick={() => setStatusFilter('watched')}>Vistos</button>
                        <button className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>Pendientes</button>
                    </div>
                </div>
            </>
        )}

        {/* GRID DE CONTENIDO */}
        {filteredCollection.length === 0 ? (
            <div className="empty-state">
               {myCollection.length === 0 ? (
                   <>
                    <h2>Tu repositorio está vacío</h2>
                    <p>Pulsa el botón + para empezar.</p>
                   </>
               ) : (
                   <p>No se encontraron resultados con estos filtros.</p>
               )}
            </div>
        ) : (
          <div className="grid-container">
            {filteredCollection.map((item) => (
              /* AL CLICAR EN EL ENVOLTORIO, ABRIMOS EL MODAL DE DETALLE */
              <div 
                key={item.id} 
                className="card-wrapper"
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  title={item.Title}
                  year={item.Year}
                  posterPath={item.Poster}
                  rating={item.rating}
                  overview={item.overview}
                  status={item.status || 'pending'} 
                  // Pasamos las funciones para que los botones de la tarjeta funcionen
                  onDelete={() => handleDelete(item.id)}
                  onToggleStatus={() => toggleStatus(item.id, item.status || 'pending')}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BOTÓN FLOTANTE (+) */}
      <button className="floating-add-btn" onClick={() => setShowModal(true)}>+</button>
      
      {/* MODAL DE BÚSQUEDA (AÑADIR) */}
      {showModal && (
        <SearchModal 
            onClose={() => setShowModal(false)} 
            onAdd={handleAddToCollection} 
        />
      )}

      {/* MODAL DE DETALLE (VER INFO) */}
      {selectedItem && (
        <DetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

export default Show;