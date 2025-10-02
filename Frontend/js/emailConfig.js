const EMAILJS_CONFIG = {
  serviceId: 'service_pd7it7n',          // el tuyo actual
  templateId: 'template_aulcwum',        // (reset password) ya en uso
  templateIdRegistration: 'template_vmb0aof', // ⬅️ NUEVO: bienvenida
  publicKey: 'KMZHCq9JJQ5hOmshK'         // tu public key actual
};

window.EMAILJS_CONFIG = EMAILJS_CONFIG;

// (opcional) validador
function isEmailJSRegistrationConfigured() {
  return !!(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateIdRegistration && EMAILJS_CONFIG.publicKey);
}
window.isEmailJSRegistrationConfigured = isEmailJSRegistrationConfigured;
