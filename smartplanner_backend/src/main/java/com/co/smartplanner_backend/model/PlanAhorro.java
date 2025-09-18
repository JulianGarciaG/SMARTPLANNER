package com.co.smartplanner_backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "plan_ahorro")
public class PlanAhorro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan_ahorro")  
    private Integer idPlanAhorro;

    @Column(name = "nombre_plan", nullable = false, length = 80)
    private String nombrePlan;

    @Column(precision = 12, scale = 2)
    private BigDecimal montoActual;

    @Column(precision = 12, scale = 2)
    private BigDecimal montoMeta;
    

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario") 
    private Usuario usuario;

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

    public BigDecimal getMontoActual() {
        return montoActual;
    }

    public void setMontoActual(BigDecimal montoActual) {
        this.montoActual = montoActual;
    }

    public BigDecimal getMontoMeta() {
        return montoMeta;
    }

    public void setMontoMeta(BigDecimal montoMeta) {
        this.montoMeta = montoMeta;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
