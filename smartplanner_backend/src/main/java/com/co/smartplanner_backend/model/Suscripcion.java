package com.co.smartplanner_backend.model;



import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Suscripcion")
public class Suscripcion {

    public enum EstadoSuscripcion {
        activa, cancelada, vencida, pendiente
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suscripcion")
    private Integer idSuscripcion;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_tipo_plan", nullable = false)
    private Integer idTipoPlan;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSuscripcion estado = EstadoSuscripcion.pendiente;

    @Column(name = "precio_pagado", nullable = false)
    private BigDecimal precioPagado;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private Pago.MetodoPago metodoPago;

    // Getters y Setters
    public Integer getIdSuscripcion() { return idSuscripcion; }
    public void setIdSuscripcion(Integer idSuscripcion) { this.idSuscripcion = idSuscripcion; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdTipoPlan() { return idTipoPlan; }
    public void setIdTipoPlan(Integer idTipoPlan) { this.idTipoPlan = idTipoPlan; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public EstadoSuscripcion getEstado() { return estado; }
    public void setEstado(EstadoSuscripcion estado) { this.estado = estado; }

    public BigDecimal getPrecioPagado() { return precioPagado; }
    public void setPrecioPagado(BigDecimal precioPagado) { this.precioPagado = precioPagado; }

    public Pago.MetodoPago getMetodoPago() { return metodoPago; }
    public void setMetodoPago(Pago.MetodoPago metodoPago) { this.metodoPago = metodoPago; }
}
