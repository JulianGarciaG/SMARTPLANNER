package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Buscar token por código y email
    Optional<PasswordResetToken> findByTokenAndEmail(String token, String email);

    // Buscar token por código
    Optional<PasswordResetToken> findByToken(String token);

    // Buscar tokens válidos por email
    @Query("SELECT t FROM PasswordResetToken t WHERE t.email = :email AND t.used = false AND t.expiresAt > :now ORDER BY t.createdAt DESC")
    List<PasswordResetToken> findValidTokensByEmail(@Param("email") String email, @Param("now") LocalDateTime now);

    // Buscar el token más reciente válido por email
    @Query("SELECT t FROM PasswordResetToken t WHERE t.email = :email AND t.used = false AND t.expiresAt > :now ORDER BY t.createdAt DESC")
    Optional<PasswordResetToken> findLatestValidTokenByEmail(@Param("email") String email, @Param("now") LocalDateTime now);

    // Eliminar tokens expirados
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    // Eliminar tokens usados
    void deleteByUsedTrue();

    // Contar tokens activos por email (para limitar envíos)
    @Query("SELECT COUNT(t) FROM PasswordResetToken t WHERE t.email = :email AND t.used = false AND t.expiresAt > :now")
    long countActiveTokensByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
}
