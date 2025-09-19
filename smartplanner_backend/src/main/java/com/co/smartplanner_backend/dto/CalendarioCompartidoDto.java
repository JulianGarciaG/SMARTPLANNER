package com.co.smartplanner_backend.dto;

public class CalendarioCompartidoDto {
    private Integer idUsuario;
    private Integer idCalendario;
    private String permiso; // "ver", "editar", "eliminar"

    // Getters y Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Integer idCalendario) { this.idCalendario = idCalendario; }

    public String getPermiso() { return permiso; }
    public void setPermiso(String permiso) { this.permiso = permiso; }
}

