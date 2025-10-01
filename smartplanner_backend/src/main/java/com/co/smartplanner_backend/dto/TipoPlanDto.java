package com.co.smartplanner_backend.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TipoPlanDto {
    private Integer idTipoPlan;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String periodo;
    private Integer maxCalendarios;
    private Integer maxEventosMes;
    private Integer maxUsuariosEquipo;
    private Boolean soportePrioritario;
    private Boolean backupAutomatico;
    private Boolean integracionesAvanzadas;
    private Boolean dashboardEmpresarial;
    private Boolean reportesPersonalizados;
    private Boolean consultoriaPersonalizada;
    private Boolean apiPersonalizada;
    private Boolean activo;
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

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }

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

