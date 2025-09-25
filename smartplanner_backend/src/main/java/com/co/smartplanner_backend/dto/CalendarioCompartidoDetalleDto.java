package com.co.smartplanner_backend.dto;

public class CalendarioCompartidoDetalleDto {
    private Integer idCalendario;
    private String nombre;
    private String color;
    private String permiso;

    public CalendarioCompartidoDetalleDto(Integer idCalendario, String nombre, String color, String permiso) {
        this.idCalendario = idCalendario;
        this.nombre = nombre;
        this.color = color;
        this.permiso = permiso;
    }

    // Getters y Setters
    public Integer getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Integer idCalendario) { this.idCalendario = idCalendario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getPermiso() { return permiso; }
    public void setPermiso(String permiso) { this.permiso = permiso; }
}
