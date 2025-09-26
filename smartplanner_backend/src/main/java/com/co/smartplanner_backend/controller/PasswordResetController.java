package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.model.PasswordResetToken;
import com.co.smartplanner_backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    // Endpoint para solicitar código de recuperación
    @PostMapping("/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El email es requerido"));
            }

            // Crear token de recuperación
            PasswordResetToken token = passwordResetService.createPasswordResetToken(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Código de verificación enviado a tu email");
            response.put("token", token.getToken()); // En desarrollo, en producción no enviar
            response.put("expiresAt", token.getExpiresAt());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Endpoint para verificar código
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El email es requerido"));
            }
            
            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El código es requerido"));
            }

            // Verificar código
            boolean isValid = passwordResetService.validateToken(code, email);
            
            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Código verificado correctamente");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(createErrorResponse("Código inválido o expirado"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Endpoint para cambiar contraseña
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            String newPassword = request.get("newPassword");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El email es requerido"));
            }
            
            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El código es requerido"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("La nueva contraseña es requerida"));
            }

            // Validar longitud de contraseña
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(createErrorResponse("La contraseña debe tener al menos 6 caracteres"));
            }

            // Cambiar contraseña
            boolean success = passwordResetService.resetPassword(code, email, newPassword);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Contraseña cambiada exitosamente");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(createErrorResponse("No se pudo cambiar la contraseña. Verifica el código"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Endpoint para verificar si hay tokens activos
    @GetMapping("/status/{email}")
    public ResponseEntity<?> getResetStatus(@PathVariable String email) {
        try {
            boolean hasActiveTokens = passwordResetService.hasActiveTokens(email);
            long timeRemaining = passwordResetService.getTokenTimeRemaining(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hasActiveTokens", hasActiveTokens);
            response.put("timeRemaining", timeRemaining);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Método auxiliar para crear respuestas de error
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return errorResponse;
    }
}
