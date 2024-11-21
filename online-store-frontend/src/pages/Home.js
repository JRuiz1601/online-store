import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { FiEdit2, FiTrash2, FiShoppingCart, FiPlus, FiX } from 'react-icons/fi';
import '../styles/Login.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    <div className="home-container fade-in">
      <div className="products-header">
        <h1 className="section-title">Productos Disponibles</h1>
        {isAdmin && (
          <button 
            className="add-product-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> Nuevo Producto
          </button>
        )}
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card scale-in">
            <div className="product-image-container">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <div className="product-overlay">
                <button 
                  className="cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <FiShoppingCart /> Agregar al Carrito
                </button>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-price">${product.price}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>

              {isAdmin && (
                <div className="admin-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && showForm && (
        <div className="modal-wrapper fade-in">
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal-content scale-in">
            <div className="modal-header">
              <h2>Agregar Producto</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <FiX />
              </button>
            </div>
            <ProductForm onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {isEditing && (
        <div className="modal-wrapper fade-in">
          <div className="modal-overlay" onClick={() => setIsEditing(false)}></div>
          <div className="modal-content scale-in">
            <div className="modal-header">
              <h2>Editar Producto</h2>
              <button className="close-btn" onClick={() => setIsEditing(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-group">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentProduct?.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción:</label>
                <textarea
                  className="form-control"
                  value={currentProduct?.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio:</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentProduct?.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock:</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentProduct?.stock}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Guardar Cambios
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;