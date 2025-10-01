package com.co.smartplanner_backend.repository;


import com.co.smartplanner_backend.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findBySuscripcion_IdSuscripcion(Integer idSuscripcion);
    List<Pago> findBySuscripcion_IdUsuario(Integer idUsuario);
    Optional<Pago> findByReferenciaPago(String referenciaPago);
    List<Pago> findByEstadoPago(Pago.EstadoPago estadoPago);
}


