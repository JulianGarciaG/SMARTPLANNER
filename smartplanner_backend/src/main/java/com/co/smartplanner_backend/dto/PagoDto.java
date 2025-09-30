package com.co.smartplanner_backend.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PagoDto {
    private Integer idPago;
    private Integer idSuscripcion;
    private BigDecimal monto;
    private LocalDateTime fechaPago;
    private String metodoPago;
    private String estadoPago;
    private String referenciaPago;
    private String datosPago;
    private LocalDateTime createdAt;

    // Getters y setters
    public Integer getIdPago() { return idPago; }
    public void setIdPago(Integer idPago) { this.idPago = idPago; }

    public Integer getIdSuscripcion() { return idSuscripcion; }
    public void setIdSuscripcion(Integer idSuscripcion) { this.idSuscripcion = idSuscripcion; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getEstadoPago() { return estadoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }

    public String getReferenciaPago() { return referenciaPago; }
    public void setReferenciaPago(String referenciaPago) { this.referenciaPago = referenciaPago; }

    public String getDatosPago() { return datosPago; }
    public void setDatosPago(String datosPago) { this.datosPago = datosPago; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
