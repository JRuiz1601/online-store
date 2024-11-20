const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Invoice = require('../modelsRelational/Invoice'); // Factura en MySQL
const InvoiceDetails = require('../modelsRelational/invoiceDetails');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (existingProductIndex >= 0) {
      // Actualizar la cantidad si el producto ya está en el carrito
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Agregar el producto al carrito
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCart = async (req, res) => {
  const { productId } = req.params; // Ahora el productId viene de req.params
  const { quantity } = req.body;

  // Validar que la cantidad sea un número válido
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params; // Ahora el productId viene de req.params

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    // Depurar: Verificar los IDs antes de filtrar
    console.log('Producto en el carrito antes de eliminar:');
    cart.products.forEach((product) => {
      console.log('Product ID:', product.productId.toString());
      console.log('Param Product ID:', productId);
    });

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Finalizar compra y generar factura con detalles de productos
exports.checkoutCart = async (req, res) => {
  try {
    // 1. Obtener el carrito del usuario
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // 2. Calcular el total de la compra
    let total = 0;
    for (const item of cart.products) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto: ${product.name}`,
        });
      }
      total += product.price * item.quantity;
    }

    // 3. Crear una factura en MySQL
    const invoice = await Invoice.create({
      userId: req.user._id.toString(),
      total,
    });

    // 4. Registrar detalles de los productos en la factura
    for (const item of cart.products) {
      const product = item.productId;

      // Actualizar el stock del producto
      product.stock -= item.quantity;
      await product.save();

      // Agregar detalle del producto en la factura
      await InvoiceDetails.create({
        invoiceId: invoice.id,
        productId: product._id.toString(),
        productName: product.name, // Agregar el nombre del producto
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 5. Vaciar el carrito en MongoDB
    cart.products = [];
    await cart.save();

    // 6. Responder con la factura generada y sus detalles
    const invoiceWithDetails = await Invoice.findByPk(invoice.id, {
      include: [{ model: InvoiceDetails }],
    });

    res.status(201).json({
      message: 'Compra finalizada exitosamente',
      invoice: invoiceWithDetails,
    });
  } catch (err) {
    console.error('Error al finalizar la compra:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
