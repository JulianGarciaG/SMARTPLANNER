package com.co.smartplanner_backend.dto;

import java.time.LocalDate;

public class PlanAhorroDto {
    private Integer idPlanAhorro;
    private String nombrePlan;
    private Double montoActual;
    private Double montoMeta;
    private LocalDate fechaFin;
    private Integer idUsuario;

    // Getters y Setters
    public Integer getIdPlanAhorro() {
        return idPlanAhorro;
    }

    public void setIdPlanAhorro(Integer idPlanAhorro) {
        this.idPlanAhorro = idPlanAhorro;
    }

    public String getNombrePlan() {
        return nombrePlan;
    }

    public void setNombrePlan(String nombrePlan) {
        this.nombrePlan = nombrePlan;
    }

    public Double getMontoActual() {
        return montoActual;
    }

    public void setMontoActual(Double montoActual) {
        this.montoActual = montoActual;
    }

    public Double getMontoMeta() {
        return montoMeta;
    }

    public void setMontoMeta(Double montoMeta) {
        this.montoMeta = montoMeta;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}

