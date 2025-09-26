// EmailJS Configuration
// La configuración se carga desde emailConfig.js

// Inicializar EmailJS
(function() {
    // Cargar EmailJS desde CDN si no está cargado
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = function() {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        };
        document.head.appendChild(script);
    } else {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
})();

class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initPromise = this.initializeEmailJS();
    }

    async initializeEmailJS() {
        return new Promise((resolve) => {
            if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG) {
                emailjs.init(window.EMAILJS_CONFIG.publicKey);
                this.isInitialized = true;
                resolve(true);
            } else {
                // Esperar a que se cargue EmailJS y la configuración
                const checkEmailJS = setInterval(() => {
                    if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG) {
                        emailjs.init(window.EMAILJS_CONFIG.publicKey);
                        this.isInitialized = true;
                        clearInterval(checkEmailJS);
                        resolve(true);
                    }
                }, 100);
            }
        });
    }

    async sendPasswordResetEmail(email, resetCode) {
        try {
            await this.initPromise; // Esperar a que EmailJS esté inicializado

            if (!this.isInitialized) {
                throw new Error('EmailJS no está inicializado');
            }

            // Verificar configuración
            if (!window.EMAILJS_CONFIG) {
                throw new Error('Configuración de EmailJS no encontrada');
            }

            if (!window.EMAILJS_CONFIG.serviceId) {
                throw new Error('Service ID no configurado correctamente');
            }

            if (!window.EMAILJS_CONFIG.templateId) {
                throw new Error('Template ID no configurado correctamente');
            }

            if (!window.EMAILJS_CONFIG.publicKey) {
                throw new Error('Public Key no configurado correctamente');
            }

            const templateParams = {
                to_email: email,
                reset_code: resetCode,
                app_name: 'SmartPlanner',
                from_name: 'SmartPlanner Team'
            };

            console.log('Enviando email con configuración:', {
                serviceId: window.EMAILJS_CONFIG.serviceId,
                templateId: window.EMAILJS_CONFIG.templateId,
                templateParams: templateParams
            });

            const response = await emailjs.send(
                window.EMAILJS_CONFIG.serviceId,
                window.EMAILJS_CONFIG.templateId,
                templateParams
            );

            console.log('Email enviado exitosamente:', response);
            return { success: true, message: 'Email enviado correctamente' };

        } catch (error) {
            console.error('Error enviando email:', error);
            
            // Proporcionar más detalles del error
            let errorMessage = 'Error enviando email: ';
            
            if (error.status) {
                errorMessage += `Status ${error.status}: `;
            }
            
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Error desconocido';
            }

            return { 
                success: false, 
                message: errorMessage,
                error: error
            };
        }
    }

    // Método para verificar si EmailJS está configurado
    isConfigured() {
        return window.isEmailJSConfigured && window.isEmailJSConfigured();
    }

    // Método para obtener la configuración actual
    getConfig() {
        return window.EMAILJS_CONFIG ? { ...window.EMAILJS_CONFIG } : null;
    }
}

// Crear instancia global
window.emailService = new EmailService();

// Función de utilidad para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos básicos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Colores según el tipo
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }

    // Agregar al DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Exportar para uso en otros archivos
window.showNotification = showNotification;
