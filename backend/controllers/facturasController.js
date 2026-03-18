// facturasController.js - Genera factura HTML profesional

const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Direccion = require('../models/Direccion');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');

const obtenerFacturaHTML = async (req, res) => {
    try {
        const { pedidoId } = req.params;

        // Obtener pedido con relaciones
        const pedido = await Pedido.findById(pedidoId).populate('clienteId').populate('direccionId');
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Obtener detalles del pedido
        const detalles = await DetallePedido.find({ pedidoId }).populate('productoId');
        
        // Datos formateados
        const cliente = pedido.clienteId;
        const direccion = pedido.direccionId;
        const numeroPedido = pedidoId.substring(0, 8).toUpperCase();
        const fechaFormato = new Date(pedido.fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Generar filas de productos para la tabla HTML
        let filasProductos = '';
        let subtotal = 0;

        detalles.forEach(detalle => {
            const subitem = detalle.cantidad * detalle.precioUnitario;
            subtotal += subitem;
            filasProductos += `
                <tr>
                    <td style="padding: 10px;">${detalle.productoId.nombre}</td>
                    <td style="padding: 10px; text-align: center;">${detalle.cantidad}</td>
                    <td style="padding: 10px; text-align: right;">$${detalle.precioUnitario.toLocaleString('es-CO')}</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">$${subitem.toLocaleString('es-CO')}</td>
                </tr>
            `;
        });

        const envio = 5000;
        const total = pedido.total || (subtotal + envio);

        // HTML profesional
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura #${numeroPedido} - Sweet Bakery</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    background: #f5f5f5;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #c16922;
                    padding-bottom: 20px;
                }
                .header h1 {
                    font-size: 2.5rem;
                    color: #c16922;
                    margin-bottom: 10px;
                }
                .header p {
                    color: #666;
                    font-size: 0.9rem;
                }
                .factura-numero {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #c16922;
                }
                .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin: 20px 0;
                }
                .section {
                    padding: 15px;
                    background: #f9f9f9;
                    border-radius: 5px;
                    border-left: 4px solid #c16922;
                }
                .section h3 {
                    color: #c16922;
                    margin-bottom: 10px;
                    font-size: 0.95rem;
                }
                .section p {
                    margin: 5px 0;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                table {
                    width: 100%;
                    margin: 30px 0;
                    border-collapse: collapse;
                }
                table thead {
                    background: #c16922;
                    color: white;
                }
                table th {
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                }
                table td {
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                }
                table tbody tr:hover {
                    background: #f9f9f9;
                }
                .total-section {
                    text-align: right;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 2px solid #c16922;
                }
                .total-row {
                    display: flex;
                    justify-content: flex-end;
                    gap: 40px;
                    margin: 10px 0;
                    font-size: 0.95rem;
                }
                .total-monto {
                    font-weight: bold;
                    min-width: 150px;
                    text-align: right;
                }
                .total-final {
                    font-size: 1.4rem;
                    color: #c16922;
                    font-weight: bold;
                    margin-top: 20px;
                    padding: 15px;
                    background: #f0f0f0;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 0.85rem;
                }
                .badges {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-top: 15px;
                    flex-wrap: wrap;
                }
                .badge {
                    background: #c16922;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                .badge.entrega {
                    background: #4CAF50;
                }
                .badge.pago {
                    background: #2196F3;
                }
                @media print {
                    body {
                        background: white;
                    }
                    .container {
                        box-shadow: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎂 SWEET BAKERY</h1>
                    <p>Pastelería Artesanal by Angel</p>
                </div>

                <div class="factura-numero">
                    FACTURA DE PEDIDO #${numeroPedido}
                </div>

                <div class="row">
                    <div class="section">
                        <h3>👤 INFORMACIÓN DEL CLIENTE</h3>
                        <p><strong>${cliente.nombreCompleto}</strong></p>
                        <p>📞 ${cliente.telefono}</p>
                        ${cliente.email ? `<p>📧 ${cliente.email}</p>` : ''}
                    </div>

                    <div class="section">
                        <h3>📅 INFORMACIÓN DEL PEDIDO</h3>
                        <p><strong>Fecha:</strong> ${fechaFormato}</p>
                        <p><strong>Estado:</strong> ${pedido.estado === 'pendiente' ? '⏳ En Preparación' : pedido.estado}</p>
                        <p><strong>Entrega:</strong> Domicilio</p>
                    </div>
                </div>

                ${direccion ? `
                <div class="section" style="grid-column: 1/-1;">
                    <h3>📍 DIRECCIÓN DE ENTREGA</h3>
                    <p>${direccion.direccion}</p>
                    <p>${direccion.ciudad}</p>
                    ${direccion.referencia ? `<p><strong>Referencia:</strong> ${direccion.referencia}</p>` : ''}
                </div>
                ` : ''}

                <table>
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>CANTIDAD</th>
                            <th>PRECIO UNITARIO</th>
                            <th>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasProductos}
                    </tbody>
                </table>

                <div class="total-section">
                    <div class="total-row">
                        <div>Subtotal:</div>
                        <div class="total-monto">$${subtotal.toLocaleString('es-CO')}</div>
                    </div>
                    <div class="total-row">
                        <div>Envío (Cali):</div>
                        <div class="total-monto">$${envio.toLocaleString('es-CO')}</div>
                    </div>
                    <div class="total-final">
                        TOTAL A PAGAR: $${total.toLocaleString('es-CO')}
                    </div>
                </div>

                <div class="row" style="margin-top: 30px;">
                    <div class="section">
                        <h3>💳 MÉTODO DE PAGO</h3>
                        <p>${pedido.metodoPago === 'efectivo' ? '✋ Efectivo contra entrega' : '🏦 Transferencia bancaria'}</p>
                    </div>

                    <div class="section">
                        <h3>🚚 TIEMPO DE ENTREGA</h3>
                        <p>⏰ 2-4 horas de preparación</p>
                        <p>📦 48 horas máximo de entrega</p>
                    </div>
                </div>

                <div class="badges">
                    <div class="badge">✅ CONFIRMADO</div>
                    <div class="badge entrega">📍 DOMICILIO</div>
                    <div class="badge pago">${pedido.metodoPago === 'efectivo' ? '💵 EFECTIVO' : '🏦 TRANSFERENCIA'}</div>
                </div>

                <div class="footer">
                    <p><strong>¡Gracias por tu compra!</strong></p>
                    <p>Tu pedido está siendo preparado con amor en nuestro taller artesanal.</p>
                    <p style="margin-top: 10px;">Cualquier duda, contáctanos por WhatsApp: <strong>+573014132284</strong></p>
                    <p style="margin-top: 20px; font-size: 0.75rem;">Sweet Bakery by Angel © 2026 - Cali, Colombia</p>
                </div>
            </div>
        </body>
        </html>
        `;

        res.send(html);

    } catch (error) {
        console.error('❌ Error al obtener factura:', error);
        res.status(500).json({ mensaje: 'Error al generar factura', error: error.message });
    }
};

module.exports = { obtenerFacturaHTML };
