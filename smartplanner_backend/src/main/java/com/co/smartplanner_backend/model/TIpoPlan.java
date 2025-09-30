package com.co.smartplanner_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Tipo_Plan")
public class TIpoPlan {

    public enum Periodo {
        mensual, anual
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_plan")
    private Integer idTipoPlan;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Periodo periodo;

    @Column(name = "max_calendarios")
    private Integer maxCalendarios;

    @Column(name = "max_eventos_mes")
    private Integer maxEventosMes;

    @Column(name = "max_usuarios_equipo")
    private Integer maxUsuariosEquipo;

    @Column(name = "soporte_prioritario")
    private Boolean soportePrioritario = false;

    @Column(name = "backup_automatico")
    private Boolean backupAutomatico = false;

    @Column(name = "integraciones_avanzadas")
    private Boolean integracionesAvanzadas = false;

    @Column(name = "dashboard_empresarial")
    private Boolean dashboardEmpresarial = false;

    @Column(name = "reportes_personalizados")
    private Boolean reportesPersonalizados = false;

    @Column(name = "consultoria_personalizada")
    private Boolean consultoriaPersonalizada = false;

    @Column(name = "api_personalizada")
    private Boolean apiPersonalizada = false;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Getters y setters

    public Integer getIdTipoPlan() { return idTipoPlan; }
    public void setIdTipoPlan(Integer idTipoPlan) { this.idTipoPlan = idTipoPlan; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Periodo getPeriodo() { return periodo; }
    public void setPeriodo(Periodo periodo) { this.periodo = periodo; }

    public Integer getMaxCalendarios() { return maxCalendarios; }
    public void setMaxCalendarios(Integer maxCalendarios) { this.maxCalendarios = maxCalendarios; }

    public Integer getMaxEventosMes() { return maxEventosMes; }
    public void setMaxEventosMes(Integer maxEventosMes) { this.maxEventosMes = maxEventosMes; }

    public Integer getMaxUsuariosEquipo() { return maxUsuariosEquipo; }
    public void setMaxUsuariosEquipo(Integer maxUsuariosEquipo) { this.maxUsuariosEquipo = maxUsuariosEquipo; }

    public Boolean getSoportePrioritario() { return soportePrioritario; }
    public void setSoportePrioritario(Boolean soportePrioritario) { this.soportePrioritario = soportePrioritario; }

    public Boolean getBackupAutomatico() { return backupAutomatico; }
    public void setBackupAutomatico(Boolean backupAutomatico) { this.backupAutomatico = backupAutomatico; }

    public Boolean getIntegracionesAvanzadas() { return integracionesAvanzadas; }
    public void setIntegracionesAvanzadas(Boolean integracionesAvanzadas) { this.integracionesAvanzadas = integracionesAvanzadas; }

    public Boolean getDashboardEmpresarial() { return dashboardEmpresarial; }
    public void setDashboardEmpresarial(Boolean dashboardEmpresarial) { this.dashboardEmpresarial = dashboardEmpresarial; }

    public Boolean getReportesPersonalizados() { return reportesPersonalizados; }
    public void setReportesPersonalizados(Boolean reportesPersonalizados) { this.reportesPersonalizados = reportesPersonalizados; }

    public Boolean getConsultoriaPersonalizada() { return consultoriaPersonalizada; }
    public void setConsultoriaPersonalizada(Boolean consultoriaPersonalizada) { this.consultoriaPersonalizada = consultoriaPersonalizada; }

    public Boolean getApiPersonalizada() { return apiPersonalizada; }
    public void setApiPersonalizada(Boolean apiPersonalizada) { this.apiPersonalizada = apiPersonalizada; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}