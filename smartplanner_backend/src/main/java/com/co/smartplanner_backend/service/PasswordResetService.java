package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.model.PasswordResetToken;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.repository.PasswordResetTokenRepository;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.springframework.transaction.annotation.Transactional;


@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Generar código de 6 dígitos
    private String generateToken() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Genera número entre 100000 y 999999
        return String.valueOf(code);
    }

    // Crear token de recuperación
    public PasswordResetToken createPasswordResetToken(String email) {
        // Verificar que el usuario existe
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(email);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("No existe un usuario con este email");
        }

        // Verificar límite de tokens activos (máximo 3 por email)
        long activeTokens = tokenRepository.countActiveTokensByEmail(email, LocalDateTime.now());
        if (activeTokens >= 3) {
            throw new RuntimeException("Has solicitado demasiados códigos. Espera antes de solicitar uno nuevo.");
        }

        // Invalidar tokens anteriores del mismo email
        invalidatePreviousTokens(email);

        // Crear nuevo token
        String token = generateToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10); // Expira en 10 minutos

        PasswordResetToken passwordResetToken = new PasswordResetToken(token, email, expiresAt);
        return tokenRepository.save(passwordResetToken);
    }

    // Validar token
    public boolean validateToken(String token, String email) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByTokenAndEmail(token, email);
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken passwordResetToken = tokenOpt.get();
            return passwordResetToken.isValid();
        }
        
        return false;
    }

    // Obtener token válido
    public Optional<PasswordResetToken> getValidToken(String token, String email) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByTokenAndEmail(token, email);
        
        if (tokenOpt.isPresent() && tokenOpt.get().isValid()) {
            return tokenOpt;
        }
        
        return Optional.empty();
    }

    // Cambiar contraseña
    public boolean resetPassword(String token, String email, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = getValidToken(token, email);
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken passwordResetToken = tokenOpt.get();
            
            // Buscar usuario
            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(email);
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                
                // Actualizar contraseña
                usuario.setContrasena(passwordEncoder.encode(newPassword));
                usuarioRepository.save(usuario);
                
                // Marcar token como usado
                passwordResetToken.setUsed(true);
                tokenRepository.save(passwordResetToken);
                
                return true;
            }
        }
        
        return false;
    }

    // Invalidar tokens anteriores del mismo email
    private void invalidatePreviousTokens(String email) {
        tokenRepository.findValidTokensByEmail(email, LocalDateTime.now())
                .forEach(token -> {
                    token.setUsed(true);
                    tokenRepository.save(token);
                });
    }

    // Limpiar tokens expirados (se ejecuta cada hora)
    @Transactional
    @Scheduled(fixedRate = 3600000) // 1 hora en milisegundos
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        tokenRepository.deleteByUsedTrue();
    }

    // Verificar si un email tiene tokens activos
    public boolean hasActiveTokens(String email) {
        return tokenRepository.countActiveTokensByEmail(email, LocalDateTime.now()) > 0;
    }

    // Obtener tiempo restante del token más reciente
    public long getTokenTimeRemaining(String email) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findLatestValidTokenByEmail(email, LocalDateTime.now());
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken token = tokenOpt.get();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiresAt = token.getExpiresAt();
            
            if (expiresAt.isAfter(now)) {
                return java.time.Duration.between(now, expiresAt).getSeconds();
            }
        }
        
        return 0;
    }
}
