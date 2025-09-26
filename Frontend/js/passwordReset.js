// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

class PasswordResetManager {
    constructor() {
        this.currentEmail = null;
        this.currentStep = 1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadEmailFromStorage();
    }

    bindEvents() {
        // Paso 1: Solicitar código
        const requestForm = document.querySelector('#request-form');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => this.handleRequestCode(e));
        }

        // Paso 2: Verificar código
        const verifyForm = document.querySelector('#verify-form');
        if (verifyForm) {
            verifyForm.addEventListener('submit', (e) => this.handleVerifyCode(e));
        }

        // Paso 3: Cambiar contraseña
        const resetForm = document.querySelector('#reset-form');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        }

        // Botón reenviar código
        const resendButton = document.querySelector('#resend-code');
        if (resendButton) {
            resendButton.addEventListener('click', () => this.handleResendCode());
        }

        // Input de código con auto-focus
        const codeInput = document.querySelector('#verification-code');
        if (codeInput) {
            codeInput.addEventListener('input', (e) => this.handleCodeInput(e));
        }
    }

    loadEmailFromStorage() {
        this.currentEmail = sessionStorage.getItem('passwordResetEmail');
        if (this.currentEmail) {
            this.updateEmailDisplay();
        }
    }

    updateEmailDisplay() {
        const emailDisplay = document.querySelector('#email-display');
        if (emailDisplay && this.currentEmail) {
            emailDisplay.textContent = this.currentEmail;
        }
    }

    async handleRequestCode(e) {
        e.preventDefault();
        
        const emailInput = document.querySelector('#email-input');
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            // Solicitar código al backend
            const response = await this.requestPasswordReset(email);
            
            if (response.success) {
                this.currentEmail = email;
                sessionStorage.setItem('passwordResetEmail', email);
                this.updateEmailDisplay();
                
                // Enviar email con el código
                const emailResult = await this.sendEmailWithCode(email, response.token);
                
                if (emailResult.success) {
                    showNotification('Código enviado a tu email', 'success');
                    // 👉 Redirigir a la vista de verificación
                    setTimeout(() => {
                        window.location.href = "../views/recuperarContraseña2.html";
                    }, 1000);
                } else {
                    showNotification('Código generado pero error enviando email: ' + emailResult.message, 'warning');
                    console.log('Código de desarrollo:', response.token);
                    // 👉 Igual redirigir aunque falle el envío del correo
                    setTimeout(() => {
                        window.location.href = "../views/recuperarContraseña2.html";
                    }, 1000);
                }
            } else {
                showNotification(response.message || 'Error solicitando código', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión. Intenta nuevamente.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleVerifyCode(e) {
        e.preventDefault();
        
        const codeInput = document.querySelector('#verification-code');
        const code = codeInput.value.trim();

        if (!code || code.length !== 6) {
            showNotification('Por favor ingresa el código de 6 dígitos', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await this.verifyCode(code);
            
            if (response.success) {
                showNotification('Código verificado correctamente', 'success');
                sessionStorage.setItem('passwordResetEmail', this.currentEmail);
                // Ir al paso 3
                window.location.href = "../views/recuperarContraseña3.html";
            } else {
                showNotification(response.message || 'Código inválido', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error verificando código', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        if (!this.validatePassword(newPassword, confirmPassword)) {
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await this.resetPassword(newPassword);
            
            if (response.success) {
                showNotification('Contraseña cambiada exitosamente', 'success');
                sessionStorage.removeItem('passwordResetEmail');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                showNotification(response.message || 'Error cambiando contraseña', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error cambiando contraseña', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleResendCode() {
        if (!this.currentEmail) {
            showNotification('No hay email para reenviar', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await this.requestPasswordReset(this.currentEmail);
            
            if (response.success) {
                const emailResult = await this.sendEmailWithCode(this.currentEmail, response.token);
                
                if (emailResult.success) {
                    showNotification('Código reenviado', 'success');
                } else {
                    showNotification('Código regenerado pero error enviando email', 'warning');
                    console.log('Código de desarrollo:', response.token);
                }
            } else {
                showNotification(response.message || 'Error reenviando código', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error reenviando código', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleCodeInput(e) {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        e.target.value = value;
        
        // Auto-submit cuando se complete el código
        if (value.length === 6) {
            setTimeout(() => {
                const form = document.querySelector('#verify-form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }, 500);
        }
    }

    // Métodos de API
    async requestPasswordReset(email) {
        const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        return await response.json();
    }

    async verifyCode(code) {
        const response = await fetch(`${API_BASE_URL}/password-reset/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: this.currentEmail, 
                code: code 
            })
        });
        return await response.json();
    }

    async resetPassword(newPassword) {
        const response = await fetch(`${API_BASE_URL}/password-reset/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: this.currentEmail, 
                code: document.querySelector('#verification-code').value,
                newPassword: newPassword 
            })
        });
        return await response.json();
    }

    async sendEmailWithCode(email, code) {
        if (typeof window.emailService !== 'undefined') {
            return await window.emailService.sendPasswordResetEmail(email, code);
        } else {
            return { success: false, message: 'EmailJS no está disponible' };
        }
    }

    // Métodos de validación
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password, confirmPassword) {
        if (password.length < 6) {
            showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return false;
        }

        return true;
    }

    // Métodos de UI
    navigateToStep(step) {
        this.currentStep = step;
        
        // Ocultar todos los pasos
        document.querySelectorAll('.step-content').forEach(el => {
            el.style.display = 'none';
        });

        // Mostrar paso actual
        const currentStepEl = document.querySelector(`#step-${step}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }

        // Actualizar indicadores de paso
        this.updateStepIndicators(step);
    }

    updateStepIndicators(activeStep) {
        document.querySelectorAll('.step-indicator div').forEach((el, index) => {
            if (index + 1 <= activeStep) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    showLoading(show) {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });

        const buttons = document.querySelectorAll('button[type="submit"]');
        buttons.forEach(btn => {
            btn.disabled = show;
            if (show) {
                btn.textContent = 'Procesando...';
            } else {
                // Restaurar texto original
                const originalText = btn.getAttribute('data-original-text') || 'Enviar código';
                btn.textContent = originalText;
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.passwordResetManager = new PasswordResetManager();
});

// Función para mostrar/ocultar contraseña (compatible con el código existente)
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const eyeOpen = button.querySelector('.eye-open');
    const eyeClosed = button.querySelector('.eye-closed');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    } else {
        input.type = 'password';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reset-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("new-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (newPassword !== confirmPassword) {
            showNotification("Las contraseñas no coinciden", "error");
            return;
        }

        const email = sessionStorage.getItem("passwordResetEmail");
        if (!email) {
            showNotification("Error: no se encontró el correo en sesión", "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/usuarios/actualizar-contrasena", {
                method: "PUT",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    correo: email,
                    nuevaContrasena: newPassword
                })
            });

            if (response.ok) {
                showNotification("Contraseña actualizada correctamente", "success");
                // Redirigir a login
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 2000);
            } else {
                const msg = await response.text();
                showNotification("Error: " + msg, "error");
            }
        } catch (err) {
            console.error(err);
            showNotification("Error de conexión al actualizar contraseña", "error");
        }
    });
});
