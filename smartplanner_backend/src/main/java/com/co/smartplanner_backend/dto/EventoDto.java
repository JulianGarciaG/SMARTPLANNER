package com.co.smartplanner_backend.dto;

import java.time.LocalDateTime;

public class EventoDto {
    private Integer idEvento;
    private String nombre;
    private String descripcion;
    private String lugar;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer idCalendario;

    // ✅ Constructor vacío (obligatorio para Jackson)
    public EventoDto() {
    }

    // Constructor con parámetros
    public EventoDto(Integer idEvento, String nombre, String descripcion, String lugar,
                LocalDateTime fechaInicio, LocalDateTime fechaFin, Integer idCalendario) {
        this.idEvento = idEvento;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.lugar = lugar;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.idCalendario = idCalendario;
    }

    // Getters y Setters
    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getIdCalendario() {
        return idCalendario;
    }

    public void setIdCalendario(Integer idCalendario) {
        this.idCalendario = idCalendario;
    }
}
