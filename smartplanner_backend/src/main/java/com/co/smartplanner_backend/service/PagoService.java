package com.co.smartplanner_backend.service;



import com.co.smartplanner_backend.model.Pago;
import com.co.smartplanner_backend.model.Suscripcion;
import com.co.smartplanner_backend.repository.PagoRepository;
import com.co.smartplanner_backend.repository.SuscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    public boolean validarDatosTarjeta(String numero, String fecha, String cvv) {
        return numero != null && numero.replaceAll("\\s","").length() >= 12 && cvv != null && (cvv.length() == 3 || cvv.length() == 4);
    }

    public Pago crearPagoParaSuscripcion(Integer idSuscripcion, Pago.MetodoPago metodoPago, String datosPago) {
        Suscripcion suscripcion = suscripcionRepository.findById(idSuscripcion)
                .orElseThrow(() -> new RuntimeException("Suscripción no encontrada"));

        Pago pago = new Pago();
        pago.setSuscripcion(suscripcion);
        pago.setMonto(suscripcion.getPrecioPagado());
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodoPago(metodoPago);
        pago.setEstadoPago(Pago.EstadoPago.pendiente);
        pago.setReferenciaPago("REF-" + System.currentTimeMillis());
        pago.setDatosPago(datosPago);

        return pagoRepository.save(pago);
    }

    public Pago simularProcesamiento(Integer idPago, boolean exitoso) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstadoPago(exitoso ? Pago.EstadoPago.completado : Pago.EstadoPago.fallido);
        return pagoRepository.save(pago);
    }

    public Pago procesarPagoExitoso(Integer idPago) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstadoPago(Pago.EstadoPago.completado);
        return pagoRepository.save(pago);
    }

    public Pago marcarPagoFallido(Integer idPago, String motivo) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstadoPago(Pago.EstadoPago.fallido);
        pago.setDatosPago((pago.getDatosPago() == null ? "{}" : pago.getDatosPago().replaceAll("}$","")) +
                         ",\"motivo_fallo\":\"" + motivo + "\"}");
        return pagoRepository.save(pago);
    }

    public Pago procesarReembolso(Integer idPago, String motivo) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        if (pago.getEstadoPago() != Pago.EstadoPago.completado) {
            throw new RuntimeException("Solo se pueden reembolsar pagos completados");
        }

        pago.setEstadoPago(Pago.EstadoPago.reembolsado);
        pago.setDatosPago((pago.getDatosPago() == null ? "{}" : pago.getDatosPago().replaceAll("}$","")) +
                         ",\"motivo_reembolso\":\"" + motivo + "\"}");
        return pagoRepository.save(pago);
    }

    // Consultas
    public List<Pago> obtenerPagosPorUsuario(Integer idUsuario) {
        return pagoRepository.findBySuscripcion_IdUsuario(idUsuario);
    }

    public List<Pago> obtenerPagosPorSuscripcion(Integer idSuscripcion) {
        return pagoRepository.findBySuscripcion_IdSuscripcion(idSuscripcion);
    }

    public Optional<Pago> obtenerPagoPorReferencia(String referencia) {
        return pagoRepository.findByReferenciaPago(referencia);
    }

    public List<Pago> obtenerPagosPorEstado(Pago.EstadoPago estado) {
        return pagoRepository.findByEstadoPago(estado);
    }
}

