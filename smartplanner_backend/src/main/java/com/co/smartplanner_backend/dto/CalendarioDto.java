package com.co.smartplanner_backend.dto;

public class CalendarioDto {
    private String nombre;
    private String tipo_de_calendario;
    private String color; // 👈 Nuevo campo

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipo_de_calendario() { return tipo_de_calendario; }
    public void setTipo_de_calendario(String tipo_de_calendario) { this.tipo_de_calendario = tipo_de_calendario; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
