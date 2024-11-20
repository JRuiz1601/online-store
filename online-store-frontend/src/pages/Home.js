import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import '../styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error al obtener productos:', err.message);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.role === 'Admin') {
        setIsAdmin(true);
      }
    }

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
      alert('Producto eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar el producto:', err.message);
      alert('No se pudo eliminar el producto');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/${currentProduct._id}`,
        currentProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Producto actualizado con éxito');
      setProducts((prev) =>
        prev.map((product) =>
          product._id === currentProduct._id ? currentProduct : product
        )
      );
      setIsEditing(false);
    } catch (err) {
      console.error('Error al actualizar el producto:', err.message);
      alert('No se pudo actualizar el producto');
    }
  };
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 }, // Enviar el producto y cantidad
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Producto agregado al carrito');
    } catch (err) {
      console.error('Error al agregar producto al carrito:', err.message);
      alert('No se pudo agregar el producto al carrito');
    }
  };
  return (
    <div>
      <h1>Productos Disponibles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            {/* Botón para agregar al carrito */}
            <button onClick={() => handleAddToCart(product._id)}>Agregar al Carrito</button>
            {isAdmin && (
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>
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
      {isAdmin && (
        <div>
          <h2>Agregar Producto</h2>
          <ProductForm />
        </div>
      )}
      {isEditing && (
        <>
          <div className="modal-overlay" onClick={() => setIsEditing(false)}></div>
          <div className="modal-container">
            <h3>Editar Producto</h3>
            <form onSubmit={handleUpdate}>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Descripción:</label>
                <textarea
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Precio:</label>
                <input
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Stock:</label>
                <input
                  type="number"
                  value={currentProduct.stock}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, stock: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" style={{ marginRight: '10px' }}>
                Guardar Cambios
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
