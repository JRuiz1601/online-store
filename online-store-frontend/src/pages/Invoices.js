import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiFileText, FiCalendar, FiDollarSign, FiPackage, FiShoppingBag } from 'react-icons/fi';
import '../styles/Login.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/invoices/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data);
      } catch (err) {
        console.error('Error al obtener facturas:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="invoices-container fade-in">
      <div className="invoices-header">
        <h1 className="section-title">
          <FiFileText className="header-icon" />
          Mis Facturas
        </h1>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : invoices.length === 0 ? (
        <div className="empty-invoices">
          <FiShoppingBag className="empty-icon" />
          <p>No tienes facturas aún</p>
          <a href="/" className="start-shopping">Comenzar a comprar</a>
        </div>
      ) : (
        <div className="invoices-grid">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="invoice-card scale-in">
              <div className="invoice-header">
                <div className="invoice-date">
                  <FiCalendar className="invoice-icon" />
                  {new Date(invoice.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="invoice-number">
                  Factura #{invoice.id}
                </div>
              </div>

              <div className="invoice-content">
                <div className="invoice-table-container">
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.InvoiceDetails.map((detail) => (
                        <tr key={detail.id}>
                          <td className="product-name">
                            <FiPackage className="product-icon" />
                            {detail.productName}
                          </td>
                          <td>${detail.price.toFixed(2)}</td>
                          <td>{detail.quantity}</td>
                          <td className="detail-total">
                            ${(detail.price * detail.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="invoice-footer">
                  <div className="total-amount">
                    <FiDollarSign className="total-icon" />
                    <span>Total</span>
                    <span className="amount">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;