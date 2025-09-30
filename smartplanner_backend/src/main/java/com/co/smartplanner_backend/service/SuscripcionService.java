package com.co.smartplanner_backend.service;


import com.co.smartplanner_backend.model.Pago;
import com.co.smartplanner_backend.model.Suscripcion;
import com.co.smartplanner_backend.model.Suscripcion.EstadoSuscripcion;
import com.co.smartplanner_backend.model.TIpoPlan;
import com.co.smartplanner_backend.repository.SuscripcionRepository;
import com.co.smartplanner_backend.repository.TipoPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SuscripcionService {

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    @Autowired
    private TipoPlanRepository tipoPlanRepository;

    public List<Suscripcion> findAll() {
        return suscripcionRepository.findAll();
    }

    public Suscripcion findById(Integer id) {
        return suscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));
    }

    public List<Suscripcion> findByUsuario(Integer idUsuario) {
        return suscripcionRepository.findByIdUsuario(idUsuario);
    }

    public Suscripcion create(Integer idUsuario, Integer idTipoPlan, LocalDate fechaInicio, 
                            LocalDate fechaFin, EstadoSuscripcion estado, String metodoPagoStr) {
        TIpoPlan tipoPlan = tipoPlanRepository.findById(idTipoPlan)
                .orElseThrow(() -> new RuntimeException("Tipo de plan no encontrado"));

        // Convertir String a enum de forma segura
        Pago.MetodoPago metodoPago;
        try {
            metodoPago = Pago.MetodoPago.valueOf(metodoPagoStr);
        } catch (Exception e) {
            metodoPago = Pago.MetodoPago.tarjeta; // valor por defecto
        }

        Suscripcion s = new Suscripcion();
        s.setIdUsuario(idUsuario);
        s.setIdTipoPlan(tipoPlan.getIdTipoPlan());
        s.setFechaInicio(fechaInicio);
        s.setFechaFin(fechaFin);
        s.setPrecioPagado(tipoPlan.getPrecio());
        s.setMetodoPago(metodoPago);
        s.setEstado(estado != null ? estado : EstadoSuscripcion.pendiente);

        return suscripcionRepository.save(s);
    }
    public Suscripcion cancel(Integer id) {
        Suscripcion s = findById(id);
        s.setEstado(Suscripcion.EstadoSuscripcion.cancelada);
        return suscripcionRepository.save(s);
    }

    // update básico
    public Suscripcion update(Integer id, Suscripcion payload) {
        Suscripcion existing = findById(id);
        existing.setFechaFin(payload.getFechaFin());
        existing.setFechaInicio(payload.getFechaInicio());
        existing.setEstado(payload.getEstado());
        // más campos si hace falta
        return suscripcionRepository.save(existing);
    }

    public void delete(Integer id) {
        suscripcionRepository.deleteById(id);
    }
}
