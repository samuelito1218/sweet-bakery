const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Direccion = require('../models/Direccion');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');

// Función para generar factura profesional para WhatsApp
function generarFacturaHTML(numeroPedido, cliente, direccion, detalles, total, metodoPago, fecha) {
    const fechaFormato = new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const horaFormato = new Date(fecha).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let productosHTML = '';
    detalles.forEach((item, index) => {
        const subtotal = item.precioUnitario * item.cantidad;
        productosHTML += `
${item.cantidad}x ${item.nombre}
Precio: $${item.precioUnitario.toLocaleString('es-CO')} × ${item.cantidad} = $${subtotal.toLocaleString('es-CO')}`;
    });

    const factura = `
╔════════════════════════════════════════╗
║    🎂 SWEET BAKERY BY ANGEL 🎂         ║
║         ¡FACTURA DE PEDIDO!           ║
╚════════════════════════════════════════╝

📋 NÚMERO DE PEDIDO: #${numeroPedido}
📅 FECHA: ${fechaFormato}
🕐 HORA: ${horaFormato}

────────────────────────────────────────
👤 CLIENTE
────────────────────────────────────────
Nombre: ${cliente.nombreCompleto}
Teléfono: ${cliente.telefono}
${cliente.email ? `Email: ${cliente.email}` : ''}

────────────────────────────────────────
📍 DIRECCIÓN DE ENTREGA
────────────────────────────────────────
${direccion.direccion}
${direccion.ciudad}
${direccion.referencia ? `Referencia: ${direccion.referencia}` : ''}

────────────────────────────────────────
📦 PRODUCTOS PEDIDOS
────────────────────────────────────────
${productosHTML}

────────────────────────────────────────
💰 RESUMEN DE PAGO
────────────────────────────────────────
Subtotal: $${(total - 5000).toLocaleString('es-CO')}
Envío: $5,000
─────────────────────────────────────────
TOTAL PEDIDO: $${total.toLocaleString('es-CO')}

💳 MÉTODO DE PAGO
────────────────────────────────────────
${metodoPago === 'efectivo' ? '✋ Efectivo contra entrega' : '🏦 Transferencia bancaria'}

────────────────────────────────────────
✅ ESTADO DEL PEDIDO: EN PREPARACIÓN
────────────────────────────────────────

⏰ TIEMPO DE PREPARACIÓN: 2-4 horas
🚚 TIEMPO DE ENTREGA: 48 horas máximo

────────────────────────────────────────
📞 SOPORTE
────────────────────────────────────────
WhatsApp: +573014132284
📍 Cali, Colombia

¡Gracias por tu compra! 🙏
Tu pedido está siendo preparado con amor.
    `.trim();

    return factura;
}

// Función para enviar notificación al dueño (DEPRECATED - usar factura directa)
// function generarNotificacionDueno(numeroPedido, cliente, total, metodoPago) {
//     // Función mantenida por compatibilidad pero ya no se usa
// }

const checkout = async (req, res) => {
    try {
        const { cliente, direccion, pedido, detalles } = req.body;

        console.log('📤 CHECKOUT INICIADO');
        console.log('Cliente:', cliente);
        console.log('Detalles:', detalles);

        // 1. Crear o encontrar cliente
        let clienteDoc = await Cliente.findOne({ telefono: cliente.telefono });
        if (!clienteDoc) {
            clienteDoc = new Cliente({
                nombreCompleto: cliente.nombreCompleto,
                email: cliente.email,
                telefono: cliente.telefono
            });
            await clienteDoc.save();
            console.log('✅ Cliente creado:', clienteDoc._id);
        } else {
            console.log('✅ Cliente encontrado:', clienteDoc._id);
        }

        // 2. Crear dirección si es domicilio
        let direccionDoc = null;
        if (pedido.metodoEntrega === 'domicilio') {
            direccionDoc = new Direccion({
                clienteId: clienteDoc._id,
                direccion: direccion.direccion,
                ciudad: direccion.ciudad || 'Cali',
                referencia: direccion.referencia || ''
            });
            await direccionDoc.save();
            console.log('✅ Dirección creada:', direccionDoc._id);
        }

        // 3. Validar productos y calcular total
        let totalCalculado = 0;
        const detallesConProducto = [];

        for (const detalle of detalles) {
            console.log('🔍 Buscando producto:', detalle.productoId, 'Tipo:', typeof detalle.productoId);
            
            const producto = await Producto.findById(detalle.productoId);
            if (!producto) {
                return res.status(404).json({ 
                    mensaje: `Producto no encontrado: ${detalle.productoId}`,
                    productoId: detalle.productoId
                });
            }

            const subtotal = detalle.precioUnitario * detalle.cantidad;
            totalCalculado += subtotal;

            detallesConProducto.push({
                ...detalle,
                nombre: producto.nombre,
                subtotal
            });

            console.log(`✅ ${producto.nombre} x${detalle.cantidad} = $${subtotal}`);
        }

        // 4. Crear pedido
        const pedidoDoc = new Pedido({
            clienteId: clienteDoc._id,
            direccionId: direccionDoc?._id || null,
            metodoEntrega: pedido.metodoEntrega,
            metodoPago: pedido.metodoPago,
            estado: 'pendiente',
            total: pedido.total || totalCalculado,
            fecha: new Date()
        });
        await pedidoDoc.save();
        console.log('✅ Pedido creado:', pedidoDoc._id);

        // 5. Crear detalles del pedido
        for (const detalle of detallesConProducto) {
            const detalleDoc = new DetallePedido({
                pedidoId: pedidoDoc._id,
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                subtotal: detalle.subtotal
            });
            await detalleDoc.save();
        }
        console.log('✅ Detalles creados');

        // 6. Generar número de pedido corto
        const numeroPedidoCorto = pedidoDoc._id.toString().substring(0, 8).toUpperCase();

        // 7. Generar factura profesional para el cliente
        const facturaCliente = generarFacturaHTML(
            numeroPedidoCorto,
            {
                nombreCompleto: clienteDoc.nombreCompleto,
                telefono: clienteDoc.telefono,
                email: clienteDoc.email
            },
            {
                direccion: direccion.direccion,
                ciudad: direccion.ciudad,
                referencia: direccion.referencia || ''
            },
            detallesConProducto,
            pedido.total || totalCalculado,
            pedido.metodoPago,
            pedidoDoc.fechaPedido
        );

        console.log('✅ Pedido completado exitosamente');

        // 9. Enviar factura al dueño por WhatsApp (en background)
        const whatsappService = require('../services/whatsappService');
        (async () => {
            try {
                // Enviar la MISMA factura al dueño
                const resultado = await whatsappService.enviarAlDueno(facturaCliente);
                console.log(`📨 Factura enviada al dueño:`, resultado);
            } catch (error) {
                console.error('⚠️ Error enviando factura al dueño:', error.message);
                // No bloqueamos el pedido si WhatsApp falla
            }
        })();

        // Responder con datos del pedido
        res.json({
            ok: true,
            pedido: {
                _id: pedidoDoc._id,
                numero: numeroPedidoCorto,
                estado: pedidoDoc.estado,
                total: pedidoDoc.total,
                fecha: pedidoDoc.fecha,
                metodoPago: pedidoDoc.metodoPago
            },
            cliente: {
                nombreCompleto: clienteDoc.nombreCompleto,
                telefono: clienteDoc.telefono,
                email: clienteDoc.email
            },
            mensajeFacturaCliente: facturaCliente
        });

    } catch (error) {
        console.error('❌ Error en checkout:', error);
        res.status(500).json({ 
            mensaje: 'Error procesando pedido',
            error: error.message
        });
    }
};

const crear = async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        res.status(201).json(pedido);
    }
    catch (error) {
        res.status(400).json({ mensaje: 'Error al crear pedido', error: error.message });
    }
};

const getUno = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message });
    }
};

const getPorCliente = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ clienteId: req.params.clienteId });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
};

module.exports = { checkout, crear, getUno, getPorCliente };