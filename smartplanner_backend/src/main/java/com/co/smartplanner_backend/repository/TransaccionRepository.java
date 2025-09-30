package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    // Busca todas las transacciones de un usuario por su id_usuario
    List<Transaccion> findByIdUsuario(Integer idUsuario);

}

