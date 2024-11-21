const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Usuario autenticado desde protect:', req.user); // Depuración
      next();
    } catch (err) {
      console.error('Error en el middleware protect:', err.message);
      res.status(401).json({ error: 'No autorizado, token inválido' });
    }
  }
  if (!token) {
    res.status(401).json({ error: 'No autorizado, no hay token' });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado, no eres administrador' });
  }
};
