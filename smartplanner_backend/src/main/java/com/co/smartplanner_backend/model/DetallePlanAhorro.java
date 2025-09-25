package com.co.smartplanner_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "detalle_plan_ahorro")
public class DetallePlanAhorro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_plan_ahorro")
    private Integer idDetallePlanAhorro;

    @Column(length = 255)
    private String descripcion;

    @Column(name = "monto_aporte", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoAporte;

    @Column(name = "fecha_aporte")
    private LocalDate fechaAporte;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean cumplido = false;

    @ManyToOne
    @JoinColumn(name = "id_plan_ahorro", nullable = false)
    private PlanAhorro planAhorro;

    // Constructores
    public DetallePlanAhorro() {}

    public DetallePlanAhorro(String descripcion, BigDecimal montoAporte, LocalDate fechaAporte, Boolean cumplido, PlanAhorro planAhorro) {
        this.descripcion = descripcion;
        this.montoAporte = montoAporte;
        this.fechaAporte = fechaAporte;
        this.cumplido = cumplido;
        this.planAhorro = planAhorro;
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

    public PlanAhorro getPlanAhorro() {
        return planAhorro;
    }

    public void setPlanAhorro(PlanAhorro planAhorro) {
        this.planAhorro = planAhorro;
    }
}