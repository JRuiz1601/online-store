import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiShoppingBag, FiCreditCard, FiMinus, FiPlus } from 'react-icons/fi';
import '../styles/Login.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Asegúrate de que los productos se extraen correctamente
        if (response.data && response.data.products) {
          setCartItems(response.data.products);
          calculateTotal(response.data.products);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Error al obtener el carrito:', err.message);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
    setTotal(total);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems = cartItems.map((item) =>
        item.productId._id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error('Error al actualizar la cantidad:', err.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedItems = cartItems.filter(item => item.productId._id !== productId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error('Error al eliminar el producto:', err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/checkout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]);
      setTotal(0);
      alert('¡Compra realizada con éxito!');
    } catch (err) {
      console.error('Error al procesar la compra:', err.message);
      alert('Hubo un problema al procesar la compra.');
    }
  };

  return (
    <div className="cart-container fade-in">
      <div className="cart-header">
        <h1 className="cart-title">
          <FiShoppingBag className="cart-icon" />
          Tu Carrito
        </h1>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <FiShoppingBag className="empty-cart-icon" />
          <p>Tu carrito está vacío</p>
          <a href="/" className="continue-shopping">Continuar comprando</a>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId._id} className="cart-item scale-in">
                <div className="item-image">
                  <img
                    src={`http://localhost:5000${item.productId.image}`}
                    alt={item.productId.name}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.productId.name}</h3>
                  <p className="item-price">${item.productId.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(
                        item.productId._id,
                        parseInt(e.target.value) || 1
                      )}
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.productId._id)}
                  >
                    <FiTrash2 />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-content">
              <h2>Resumen de Compra</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                <FiCreditCard />
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;