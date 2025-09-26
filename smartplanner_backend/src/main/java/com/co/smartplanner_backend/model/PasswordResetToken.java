package com.co.smartplanner_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 6)
    private String token;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "used", nullable = false)
    private Boolean used = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Constructores
    public PasswordResetToken() {
        this.createdAt = LocalDateTime.now();
    }

    public PasswordResetToken(String token, String email, LocalDateTime expiresAt) {
        this();
        this.token = token;
        this.email = email;
        this.expiresAt = expiresAt;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Método para verificar si el token está expirado
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // Método para verificar si el token es válido
    public boolean isValid() {
        return !used && !isExpired();
    }
}
