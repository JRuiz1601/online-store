import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Inicializa como un array vacío
  const [total, setTotal] = useState(0);

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
          setCartItems(response.data.products); // Accede al array "products"
          calculateTotal(response.data.products);
        } else {
          setCartItems([]); // Si no hay productos, establece un array vacío
        }
      } catch (err) {
        console.error('Error al obtener el carrito:', err.message);
        setCartItems([]); // Manejo de errores
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
      // Actualiza el estado local con la nueva cantidad
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      calculateTotal(cartItems);
      alert('Cantidad actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar la cantidad:', err.message);
      alert('No se pudo actualizar la cantidad');
    }
  };
  

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending Product ID:', productId); // Agrega este log para depurar
  
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Respuesta del servidor:', response.data);
      setCartItems((prev) => prev.filter((item) => item.productId._id !== productId));
      alert('Producto eliminado del carrito');
    } catch (err) {
      console.error('Error al eliminar el producto del carrito:', err.message);
    }
  };
  
  

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cart/checkout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Vaciar el estado del carrito
      setCartItems([]);
      alert('Compra finalizada con éxito. Factura generada.');
  
      console.log('Factura:', response.data.invoice); // Depuración
    } catch (err) {
      console.error('Error al finalizar la compra:', err.message);
      alert('Hubo un problema al finalizar la compra.');
    }
  };
  
  return (
    <div>
      <h1>Tu Carrito</h1>
      {cartItems && cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
              <h3>{item.productId.name}</h3>
              <p>Precio: ${item.productId.price}</p>
              <p>
                Cantidad:{' '}
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.productId._id, e.target.value)}
                />
              </p>
              <button onClick={() => handleRemoveItem(item.productId._id)}>Eliminar</button>
              </div>
          ))}
          <h2>Total: ${total}</h2>
          <button onClick={handleCheckout}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
