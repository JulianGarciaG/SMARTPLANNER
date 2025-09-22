package com.co.smartplanner_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DetallePlanAhorroDto {
    private Integer idDetallePlanAhorro;
    private String descripcion;
    private BigDecimal montoAporte;
    private LocalDate fechaAporte;
    private Boolean cumplido;
    private Integer idPlanAhorro;

    // Constructores
    public DetallePlanAhorroDto() {}

    public DetallePlanAhorroDto(Integer idDetallePlanAhorro, String descripcion, BigDecimal montoAporte, 
        LocalDate fechaAporte, Boolean cumplido, Integer idPlanAhorro) {
        this.idDetallePlanAhorro = idDetallePlanAhorro;
        this.descripcion = descripcion;
        this.montoAporte = montoAporte;
        this.fechaAporte = fechaAporte;
        this.cumplido = cumplido;
        this.idPlanAhorro = idPlanAhorro;
    }

    // Getters y Setters
    public Integer getIdDetallePlanAhorro() {
        return idDetallePlanAhorro;
    }

    public void setIdDetallePlanAhorro(Integer idDetallePlanAhorro) {
        this.idDetallePlanAhorro = idDetallePlanAhorro;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getMontoAporte() {
        return montoAporte;
    }

    public void setMontoAporte(BigDecimal montoAporte) {
        this.montoAporte = montoAporte;
    }

    public LocalDate getFechaAporte() {
        return fechaAporte;
    }

    public void setFechaAporte(LocalDate fechaAporte) {
        this.fechaAporte = fechaAporte;
    }

    public Boolean getCumplido() {
        return cumplido;
    }

    public void setCumplido(Boolean cumplido) {
        this.cumplido = cumplido;
    }

    public Integer getIdPlanAhorro() {
        return idPlanAhorro;
    }

    public void setIdPlanAhorro(Integer idPlanAhorro) {
        this.idPlanAhorro = idPlanAhorro;
    }
}