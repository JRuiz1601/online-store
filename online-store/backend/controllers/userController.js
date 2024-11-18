const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generar JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Registrar usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
      role: role || 'Client', // Asignar rol o 'Client' como predeterminado
    });

    // Guardar usuario en la base de datos
    await user.save();

    // Enviar token de autenticación
    res.status(201).json({
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar usuario por correo electrónico
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Usuario encontrado y contraseña válida
      res.json({
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Respuesta con los datos del usuario
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
