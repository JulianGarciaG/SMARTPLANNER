package com.co.smartplanner_backend.dto;




import java.math.BigDecimal;
import java.time.LocalDate;

public class SuscripcionDto {
    private Integer idSuscripcion;
    private Integer idUsuario;
    private Integer idTipoPlan;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private BigDecimal precioPagado;
    private String metodoPago;

    // Getters y setters
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

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public BigDecimal getPrecioPagado() { return precioPagado; }
    public void setPrecioPagado(BigDecimal precioPagado) { this.precioPagado = precioPagado; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}

