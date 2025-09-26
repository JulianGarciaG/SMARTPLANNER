// Configuración de EmailJS para SmartPlanner
// INSTRUCCIONES DE CONFIGURACIÓN:

/*
1. Ve a https://www.emailjs.com/ y crea una cuenta gratuita
2. Crea un nuevo servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email para recuperación de contraseña
4. Obtén tu Public Key del dashboard
5. Reemplaza los valores de abajo con tu configuración real
*/

const EMAILJS_CONFIG = {
    // PASO 2: Reemplaza con tu Service ID de EmailJS (ej: service_abc123)
    serviceId: 'service_pd7it7n',
    
    // PASO 3: Reemplaza con tu Template ID de EmailJS (ej: template_xyz789)
    templateId: 'template_aulcwum',
    
    // PASO 4: Reemplaza con tu Public Key de EmailJS (ej: abc123def456)
    publicKey: 'KMZHCq9JJQ5hOmshK'
};

// Plantilla de email sugerida para EmailJS:
/*
Asunto: Código de recuperación de contraseña - SmartPlanner

Contenido:
Hola,

Has solicitado recuperar tu contraseña en SmartPlanner.

Tu código de verificación es: {{reset_code}}

Este código expira en 10 minutos.

Si no solicitaste este cambio, puedes ignorar este email.

Saludos,
El equipo de SmartPlanner

Variables de la plantilla:
- {{to_email}}: Email del destinatario
- {{reset_code}}: Código de 6 dígitos
- {{app_name}}: Nombre de la aplicación
- {{from_name}}: Nombre del remitente
*/

// Función para verificar si la configuración está completa
function isEmailJSConfigured() {
    return EMAILJS_CONFIG.serviceId !== 'service_pd7it7n' && 
           EMAILJS_CONFIG.templateId !== 'template_aulcwum' &&
           EMAILJS_CONFIG.publicKey !== 'KMZHCq9JJQ5hOmshK';
}

// Función para mostrar instrucciones de configuración
function showConfigurationInstructions() {
    if (!isEmailJSConfigured()) {
        console.warn(`
⚠️  CONFIGURACIÓN DE EMAILJS REQUERIDA:

1. Ve a https://www.emailjs.com/
2. Crea una cuenta gratuita
3. Configura un servicio de email
4. Crea una plantilla con estas variables:
   - {{to_email}}
   - {{reset_code}}
   - {{app_name}}
   - {{from_name}}
5. Actualiza el archivo emailConfig.js con tus credenciales

Sin esta configuración, los emails no se enviarán.
        `);
    }
}

// Mostrar instrucciones al cargar
showConfigurationInstructions();

// Exportar configuración
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
window.isEmailJSConfigured = isEmailJSConfigured;
