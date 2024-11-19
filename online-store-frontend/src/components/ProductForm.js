import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('stock', formData.stock);
    form.append('image', formData.image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Producto agregado con éxito');
      window.location.reload();
    } catch (err) {
      console.error('Error al agregar producto:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
      </div>
      <div>
        <label>Imagen:</label>
        <input type="file" name="image" onChange={handleFileChange} required />
      </div>
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default ProductForm;
