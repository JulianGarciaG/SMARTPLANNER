package com.co.smartplanner_backend.dto;

/**
 * DTO para crear relación en Calendario_Compartido.
 * - Puedes enviar idUsuario (para vincular al creador) O correo (para invitar por correo).
 * - idCalendario es obligatorio.
 * - permiso: "ver", "editar", "no_compartido", "propietario", etc.
 */
public class CalendarioCompartidoDto {
    private Integer idUsuario;   // opcional: usar cuando no se comparte por correo (vincular al creador)
    private String correo;       // opcional: correo del usuario invitado
    private Integer idCalendario;
    private String permiso;      // ej: "ver", "editar", "no_compartido", "propietario"

    // Getters y Setters
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public Integer getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Integer idCalendario) { this.idCalendario = idCalendario; }

    public String getPermiso() { return permiso; }
    public void setPermiso(String permiso) { this.permiso = permiso; }
}
