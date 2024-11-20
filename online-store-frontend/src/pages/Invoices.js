import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token enviado:', token); // Depuración
    
        const response = await axios.get('http://localhost:5000/api/invoices', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Facturas obtenidas:', response.data); // Depuración
        setInvoices(response.data);
      } catch (err) {
        console.error('Error al obtener facturas:', err.message);
        alert('No se pudieron cargar las facturas');
      }
    };
    

    fetchInvoices();
  }, []);

  return (
    <div>
      <h1>Mis Facturas</h1>
      {invoices.length === 0 ? (
        <p>No tienes facturas aún.</p>
      ) : (
        <div>
          {invoices.map((invoice) => (
            <div key={invoice.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>Factura ID: {invoice.id}</h3>
              <p>Total: ${invoice.total.toFixed(2)}</p>
              <p>Fecha: {new Date(invoice.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
