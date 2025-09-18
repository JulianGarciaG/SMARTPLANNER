package com.co.smartplanner_backend.dto;

public class CalendarioDto {
    private String nombre;
    private String tipo_de_calendario; // 👈 igual que en la BD y JSON

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipo_de_calendario() { return tipo_de_calendario; }
    public void setTipo_de_calendario(String tipo_de_calendario) { 
        this.tipo_de_calendario = tipo_de_calendario; 
    }
}
