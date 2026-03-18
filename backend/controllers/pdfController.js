// controllers/facturasController.js - Generar facturas en PDF

const PDFDocument = require('pdfkit');
const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');

// Generar PDF de factura
async function generarFacturaPDF(req, res) {
    try {
        const { pedidoId } = req.params;

        // Buscar pedido con sus detalles
        const pedido = await Pedido.findById(pedidoId)
            .populate('clienteId')
            .populate('direccionId')
            .lean();

        if (!pedido) {
            return res.status(404).json({ 
                success: false, 
                error: 'Pedido no encontrado' 
            });
        }

        // Buscar detalles del pedido con productos
        const detalles = await DetallePedido.find({ pedidoId })
            .populate('productoId')
            .lean();

        if (!detalles || detalles.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'No hay detalles del pedido' 
            });
        }

        // Crear documento PDF
        const doc = new PDFDocument({ margin: 40 });

        // Headers para descargar
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Factura_${pedido._id}.pdf"`);

        // Pipe del documento al response
        doc.pipe(res);

        // ═══════════════════════════════════════════════════════════
        // ENCABEZADO
        // ═══════════════════════════════════════════════════════════
        doc.fontSize(24).font('Helvetica-Bold').text('🎂 SWEET BAKERY', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').text('by Angel', { align: 'center' });
        doc.moveDown(0.5);

        // Línea divisoria
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#c16922');
        doc.moveDown(0.5);

        // ═══════════════════════════════════════════════════════════
        // INFORMACIÓN DEL CLIENTE Y PEDIDO
        // ═══════════════════════════════════════════════════════════
        doc.fontSize(11).font('Helvetica-Bold').text('INFORMACIÓN DEL PEDIDO', { underline: true });
        doc.moveDown(0.3);
        
        doc.fontSize(10).font('Helvetica');
        doc.text(`Número Pedido: ${pedido._id.toString().slice(-6).toUpperCase()}`, { indent: 20 });
        doc.text(`Fecha: ${new Date(pedido.fechaCreacion).toLocaleDateString('es-CO')}`, { indent: 20 });
        doc.text(`Cliente: ${pedido.clienteId?.nombreCompleto || 'No especificado'}`, { indent: 20 });
        doc.text(`Teléfono: ${pedido.clienteId?.telefono || 'No especificado'}`, { indent: 20 });
        doc.moveDown(0.5);

        // ═══════════════════════════════════════════════════════════
        // DIRECCIÓN DE ENTREGA
        // ═══════════════════════════════════════════════════════════
        if (pedido.direccionId) {
            doc.fontSize(11).font('Helvetica-Bold').text('DIRECCIÓN DE ENTREGA', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10).font('Helvetica');
            doc.text(`${pedido.direccionId.direccion}`, { indent: 20 });
            doc.text(`${pedido.direccionId.ciudad}`, { indent: 20 });
            if (pedido.direccionId.referencia) {
                doc.text(`Referencia: ${pedido.direccionId.referencia}`, { indent: 20 });
            }
            doc.moveDown(0.5);
        }

        // ═══════════════════════════════════════════════════════════
        // MÉTODO DE PAGO
        // ═══════════════════════════════════════════════════════════
        doc.fontSize(11).font('Helvetica-Bold').text('MÉTODO DE PAGO', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica');
        
        const metodoPagoTexto = pedido.metodoPago === 'efectivo' 
            ? 'Efectivo (Contra Entrega)' 
            : 'Transferencia Bancaria';
        doc.text(metodoPagoTexto, { indent: 20 });
        doc.moveDown(0.5);

        // Línea divisoria
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#c16922');
        doc.moveDown(0.5);

        // ═══════════════════════════════════════════════════════════
        // TABLA DE PRODUCTOS
        // ═══════════════════════════════════════════════════════════
        doc.fontSize(11).font('Helvetica-Bold').text('PRODUCTOS', { underline: true });
        doc.moveDown(0.3);

        // Headers de tabla
        const tableTop = doc.y;
        const col1 = 50;    // Producto
        const col2 = 300;   // Cantidad
        const col3 = 380;   // Precio
        const col4 = 480;   // Subtotal

        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Producto', col1, tableTop);
        doc.text('Cantidad', col2, tableTop);
        doc.text('Precio', col3, tableTop);
        doc.text('Subtotal', col4, tableTop);
        doc.moveDown(0.3);

        // Línea debajo de headers
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#ddd');
        doc.moveDown(0.3);

        // Filas de productos
        let subtotal = 0;
        doc.fontSize(9).font('Helvetica');

        detalles.forEach((detalle) => {
            const producto = detalle.productoId;
            const cantidad = detalle.cantidad;
            const precio = detalle.precioUnitario;
            const total = precio * cantidad;
            subtotal += total;

            const nombreProducto = producto?.nombre || 'Producto no disponible';
            
            doc.text(nombreProducto, col1, doc.y, { width: 240 });
            doc.text(cantidad.toString(), col2, doc.y - 12);
            doc.text(`$${precio.toLocaleString('es-CO')}`, col3, doc.y - 12);
            doc.text(`$${total.toLocaleString('es-CO')}`, col4, doc.y - 12);
            doc.moveDown(0.8);
        });

        // Línea de separación
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#ddd');
        doc.moveDown(0.3);

        // ═══════════════════════════════════════════════════════════
        // TOTALES
        // ═══════════════════════════════════════════════════════════
        const envio = 5000;
        const total = subtotal + envio;

        doc.fontSize(10).font('Helvetica');
        doc.text('Subtotal:', col3, doc.y);
        doc.text(`$${subtotal.toLocaleString('es-CO')}`, col4, doc.y - 13);
        doc.moveDown(0.5);

        doc.text('Envío:', col3, doc.y);
        doc.text(`$${envio.toLocaleString('es-CO')}`, col4, doc.y - 13);
        doc.moveDown(0.5);

        // Total en grande
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#c16922');
        doc.moveDown(0.3);
        doc.fontSize(14).font('Helvetica-Bold').text('TOTAL:', col3, doc.y);
        doc.text(`$${total.toLocaleString('es-CO')}`, col4, doc.y - 16);
        doc.moveDown(0.5);

        // Línea divisoria
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#c16922');
        doc.moveDown(1);

        // ═══════════════════════════════════════════════════════════
        // PIE DE PÁGINA
        // ═══════════════════════════════════════════════════════════
        doc.fontSize(9).font('Helvetica').text(
            '¡Gracias por tu compra! Tu pedido será entregado en 48 horas.',
            { align: 'center' }
        );
        doc.moveDown(0.3);
        doc.text('Para consultas: +573014132284 (WhatsApp)', { align: 'center' });

        // Finalizar documento
        doc.end();

    } catch (error) {
        console.error('❌ Error generando PDF:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}

module.exports = {
    generarFacturaPDF
};
