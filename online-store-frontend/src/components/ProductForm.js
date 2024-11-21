import React, { useState } from 'react';
import axios from 'axios';
import { FiImage, FiUpload } from 'react-icons/fi';
import '../styles/Login.css';

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (onSuccess) onSuccess();
      setFormData({ name: '', description: '', price: '', stock: '', image: null });
      setPreviewImage(null);
    } catch (err) {
      console.error('Error al agregar producto:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form fade-in">
      <div className="form-group">
        <label className="form-label">Nombre</label>
        <div className="input-wrapper">
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <div className="input-wrapper">
          <textarea
            name="description"
            className="form-control textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu producto"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label className="form-label">Precio</label>
          <div className="input-wrapper">
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-group half">
          <label className="form-label">Stock</label>
          <div className="input-wrapper">
            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Imagen del Producto</label>
        <div 
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${previewImage ? 'has-image' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            name="image"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
          
          {previewImage ? (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa" />
              <button 
                type="button" 
                className="change-image-btn"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData({ ...formData, image: null });
                }}
              >
                Cambiar imagen
              </button>
            </div>
          ) : (
            <div className="upload-content">
              <FiImage className="upload-icon" />
              <p>Arrastra una imagen o haz clic para seleccionar</p>
              <span>PNG, JPG hasta 5MB</span>
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-btn login-btn"
        disabled={loading}
      >
        {loading ? (
          <span className="loading-spinner"></span>
        ) : (
          <>
            <FiUpload />
            Agregar Producto
          </>
        )}
      </button>
    </form>
  );
};

export default ProductForm;