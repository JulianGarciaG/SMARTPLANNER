package com.co.smartplanner_backend.dto;

import java.time.LocalDateTime;

public class NotificacionDto {
    private Integer idNotificacion;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaCreacion;
    private String tipo;
    private boolean leida;

    public NotificacionDto(Integer idNotificacion, String titulo, String mensaje,
                           LocalDateTime fechaCreacion, String tipo, boolean leida) {
        this.idNotificacion = idNotificacion;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.fechaCreacion = fechaCreacion;
        this.tipo = tipo;
        this.leida = leida;
    }

    // Getters y Setters
    public Integer getIdNotificacion() { return idNotificacion; }
    public void setIdNotificacion(Integer idNotificacion) { this.idNotificacion = idNotificacion; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public boolean isLeida() { return leida; }
    public void setLeida(boolean leida) { this.leida = leida; }
}
