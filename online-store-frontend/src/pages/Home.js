import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Determina si el usuario es admin

  useEffect(() => {
    // Obtener productos del backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error al obtener productos:', err.message);
      }
    };

    // Verificar si el usuario es administrador
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodifica el token JWT
      console.log('Token decodificado:', decoded); // Imprime el token decodificado
      if (decoded.role === 'Admin') {
        setIsAdmin(true);
      }
    }

    fetchProducts();
  }, []);

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Actualiza los productos después de eliminar
      setProducts(products.filter((product) => product._id !== id));
      alert('Producto eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar el producto:', err.message);
      alert('No se pudo eliminar el producto');
    }
  };

  // Función para modificar un producto (navegar a una página de edición)
  const handleEdit = (id) => {
    // Navegar a la página de edición, se implementará más adelante
    alert(`Navegando a la edición del producto con ID: ${id}`);
    // Puedes usar una ruta de edición específica con React Router aquí
  };

  return (
    <div>
      <h1>Productos Disponibles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <img
              src={`http://localhost:5000${product.image}`} // Ajusta la URL con la ruta completa del servidor
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>

            {/* Mostrar botones de editar y eliminar solo para administradores */}
            {isAdmin && (
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(product._id)} style={{ marginRight: '10px' }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(product._id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulario para agregar productos, solo visible para administradores */}
      {isAdmin && (
        <div>
          <h2>Agregar Producto</h2>
          <ProductForm />
        </div>
      )}
    </div>
  );
};

export default Home;
