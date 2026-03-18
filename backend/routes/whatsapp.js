// routes/whatsapp.js - Rutas para enviar mensajes a WhatsApp con Ultramsg API

const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');

// GET /api/whatsapp/status - Verificar estado de WhatsApp
router.get('/status', async (req, res) => {
    try {
        const estado = await whatsappService.verificarEstado();
        return res.json({
            success: true,
            ...estado
        });
    } catch (error) {
        console.error('❌ Error en status:', error.message);
        return res.status(500).json({
            success: false,
            conectado: false,
            mensaje: 'Error verificando estado: ' + error.message
        });
    }
});

// POST /api/whatsapp/send-mensaje - Enviar mensaje manual
router.post('/send-mensaje', async (req, res) => {
    try {
        const { telefono, mensaje } = req.body;

        if (!telefono || !mensaje) {
            return res.status(400).json({
                success: false,
                error: 'Teléfono y mensaje son requeridos'
            });
        }

        // Formatear número si es necesario
        let numeroFormato = telefono;
        if (!numeroFormato.startsWith('+')) {
            numeroFormato = '+57' + numeroFormato;
        }

        const resultado = await whatsappService.enviarMensajeTexto(numeroFormato, mensaje);

        return res.json({
            success: resultado.enviado,
            ...resultado
        });

    } catch (error) {
        console.error('❌ Error en send-mensaje:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
