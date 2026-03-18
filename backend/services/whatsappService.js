// whatsappService.js - Servicio WhatsApp usando Ultramsg API
const axios = require('axios');

const INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID;
const TOKEN = process.env.ULTRAMSG_TOKEN;
const OWNER_NUMBER = process.env.WHATSAPP_OWNER_NUMBER;
const BASE_URL = `https://api.ultramsg.com/${INSTANCE_ID}`;

// Validar configuración
function validarConfig() {
    return INSTANCE_ID && TOKEN && INSTANCE_ID !== 'your_instance_id_here' && TOKEN !== 'your_token_here';
}

/**
 * Enviar mensaje de texto por WhatsApp
 * @param {string} numero - Número en formato +countrycode phonenumber (ej: +573014132284)
 * @param {string} mensaje - Texto del mensaje
 * @returns {object} Resultado del envío
 */
async function enviarMensajeTexto(numero, mensaje) {
    try {
        // Validar configuración
        if (!validarConfig()) {
            console.log('⚠️  WhatsApp no configurado. Usando fallback.');
            return {
                enviado: false,
                fallback: true,
                mensaje: mensaje,
                numero: numero,
                razon: 'WhatsApp no está configurado en .env'
            };
        }

        // Formatear número - Ultramsg espera el numero sin +
        let numeroFormato = numero;
        if (numeroFormato.startsWith('+')) {
            numeroFormato = numeroFormato.substring(1);
        }

        console.log(`📱 Enviando mensaje a ${numeroFormato}...`);
        console.log(`🔗 URL: ${BASE_URL}/messages/chat`);
        console.log(`📝 Token: ${TOKEN.substring(0, 4)}...`);
        console.log(`💬 Mensaje: ${mensaje.substring(0, 50)}...`);

        // Hacer petición a Ultramsg con form-urlencoded (como en el ejemplo oficial)
        const params = new URLSearchParams();
        params.append('token', TOKEN);
        params.append('to', numeroFormato);
        params.append('body', mensaje);

        console.log(`📤 Enviando datos: token=${TOKEN.substring(0, 4)}..., to=${numeroFormato}, body_length=${mensaje.length}`);

        const response = await axios.post(`${BASE_URL}/messages/chat`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 30000
        });

        console.log(`📥 Respuesta de Ultramsg:`, JSON.stringify(response.data));

        // Ultramsg devuelve {"sent":"true","message":"ok","id":1} cuando es exitoso
        if (response.data && (response.data.success || response.data.sent === 'true' || response.data.message === 'ok')) {
            console.log(`✅ Mensaje enviado a ${numeroFormato}`);
            return {
                enviado: true,
                fallback: false,
                messageId: response.data.id || response.data.data?.messageId || 'success',
                numero: numeroFormato,
                response: response.data
            };
        } else {
            console.log(`⚠️  Error en Ultramsg: ${response.data?.message}`);
            return {
                enviado: false,
                fallback: true,
                mensaje: mensaje,
                numero: numeroFormato,
                razon: response.data?.message || 'Error desconocido',
                response: response.data
            };
        }

    } catch (error) {
        console.error('❌ Error enviando mensaje:', error.message);
        console.error('📋 Error details:', error.response?.data || error.toString());
        return {
            enviado: false,
            fallback: true,
            mensaje: mensaje,
            numero: numero,
            error: error.message,
            details: error.response?.data
        };
    }
}

/**
 * Enviar mensaje con imagen
 * @param {string} numero - Número de WhatsApp
 * @param {string} urlImagen - URL de la imagen
 * @param {string} caption - Texto del mensaje
 * @returns {object} Resultado del envío
 */
async function enviarMensajeImagen(numero, urlImagen, caption = '') {
    try {
        if (!validarConfig()) {
            return {
                enviado: false,
                fallback: true,
                razon: 'WhatsApp no está configurado'
            };
        }

        let numeroFormato = numero;
        if (numeroFormato.startsWith('+')) {
            numeroFormato = numeroFormato.substring(1);
        }

        const params = new URLSearchParams();
        params.append('token', TOKEN);
        params.append('to', numeroFormato);
        params.append('image', urlImagen);
        params.append('caption', caption);

        const response = await axios.post(`${BASE_URL}/messages/image`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 30000
        });

        if (response.data && (response.data.success || response.data.sent === 'true' || response.data.message === 'ok')) {
            console.log(`✅ Imagen enviada a ${numeroFormato}`);
            return {
                enviado: true,
                fallback: false,
                messageId: response.data.id || response.data.data?.messageId || 'success'
            };
        } else {
            return {
                enviado: false,
                fallback: true,
                razon: response.data?.message || 'Error en Ultramsg'
            };
        }

    } catch (error) {
        console.error('❌ Error enviando imagen:', error.message);
        return {
            enviado: false,
            fallback: true,
            error: error.message
        };
    }
}

/**
 * Verificar estado de la conexión
 * @returns {boolean} True si está configurado y listo
 */
function estaConectado() {
    return validarConfig();
}

/**
 * Verificar estado de Ultramsg
 * @returns {object} Estado del servicio
 */
async function verificarEstado() {
    try {
        if (!validarConfig()) {
            return {
                conectado: false,
                mensaje: '⚠️ WhatsApp no configurado. Agrega ULTRAMSG_INSTANCE_ID y ULTRAMSG_TOKEN a .env'
            };
        }

        const params = new URLSearchParams();
        params.append('token', TOKEN);

        const response = await axios.post(`${BASE_URL}/me`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 30000
        });

        if (response.data && (response.data.success || response.data.sent === 'true' || response.data.message === 'ok')) {
            return {
                conectado: true,
                mensaje: '✅ WhatsApp conectado y listo',
                numero: response.data.data?.wid
            };
        } else {
            return {
                conectado: false,
                mensaje: '⚠️ Error verificando Ultramsg: ' + response.data?.message
            };
        }

    } catch (error) {
        return {
            conectado: false,
            mensaje: '⚠️ Error conectando con Ultramsg: ' + error.message
        };
    }
}

/**
 * Enviar mensaje al dueño
 * @param {string} mensaje - Texto del mensaje
 * @returns {object} Resultado del envío
 */
async function enviarAlDueno(mensaje) {
    return enviarMensajeTexto(`+${OWNER_NUMBER}`, mensaje);
}

module.exports = {
    enviarMensajeTexto,
    enviarMensajeImagen,
    estaConectado,
    verificarEstado,
    enviarAlDueno
};
