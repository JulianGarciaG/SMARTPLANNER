# Configuración de Email para Recuperar Contraseña

## Resumen
El sistema de recuperar contraseña utiliza **EmailJS** para enviar códigos de verificación por email de forma gratuita.

## Pasos para Configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar un servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. **Anota el Service ID** que se genera

### 3. Crear plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta configuración:

**Asunto:**
```
Código de recuperación de contraseña - SmartPlanner
```

**Contenido:**
```
Hola,

Has solicitado recuperar tu contraseña en SmartPlanner.

Tu código de verificación es: {{reset_code}}

Este código expira en 10 minutos.

Si no solicitaste este cambio, puedes ignorar este email.

Saludos,
El equipo de SmartPlanner
```

4. **Anota el Template ID** que se genera

### 4. Obtener Public Key
1. Ve a "Account" → "General"
2. Copia tu **Public Key**

### 5. Configurar el proyecto
1. Abre el archivo `Frontend/js/emailConfig.js`
2. Reemplaza los valores:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_pd7it7n',        // Del paso 2
    templateId: 'template_aulcwum',      // Del paso 3
    publicKey: 'KMZHCq9JJQ5hOmshK'         // Del paso 4
};
```

## Límites de EmailJS Gratuito
- **200 emails por mes**
- **2 servicios de email**
- **2 plantillas**

## Funcionamiento del Sistema

### Flujo completo:
1. Usuario ingresa email → Backend valida que existe
2. Backend genera código de 6 dígitos (expira en 10 min)
3. EmailJS envía email con el código
4. Usuario ingresa código → Backend valida
5. Usuario ingresa nueva contraseña → Backend actualiza

### Seguridad:
- Códigos expiran en 10 minutos
- Máximo 3 códigos activos por email
- Códigos se invalidan al usar
- Limpieza automática de tokens expirados

## Pruebas

### Modo desarrollo:
- Si EmailJS no está configurado, el código se muestra en la consola del navegador
- Los emails se envían normalmente si está configurado

### Verificar configuración:
```javascript
// En la consola del navegador:
console.log(window.emailService.isConfigured());
```

## Solución de Problemas

### Error: "EmailJS no está inicializado"
- Verifica que `emailConfig.js` se carga antes que `emailService.js`
- Revisa que la Public Key es correcta

### Error: "Service not found"
- Verifica que el Service ID es correcto
- Asegúrate de que el servicio está activo en EmailJS

### Error: "Template not found"
- Verifica que el Template ID es correcto
- Asegúrate de que la plantilla está publicada

### Emails no llegan:
- Revisa la carpeta de spam
- Verifica que el email de destino es válido
- Revisa los logs en el dashboard de EmailJS

## Archivos Modificados

### Backend:
- `PasswordResetToken.java` - Modelo para códigos
- `PasswordResetTokenRepository.java` - Repositorio
- `PasswordResetService.java` - Lógica de negocio
- `PasswordResetController.java` - Endpoints REST
- `pom.xml` - Dependencias de email

### Frontend:
- `emailConfig.js` - Configuración de EmailJS
- `emailService.js` - Servicio de email
- `passwordReset.js` - Lógica del flujo
- `recuperarContraseña.html` - Página 1
- `recuperarContraseña2.html` - Página 2
- `recuperarContraseña3.html` - Página 3

## Endpoints de la API

- `POST /api/password-reset/request` - Solicitar código
- `POST /api/password-reset/verify` - Verificar código
- `POST /api/password-reset/reset` - Cambiar contraseña
- `GET /api/password-reset/status/{email}` - Estado de tokens
