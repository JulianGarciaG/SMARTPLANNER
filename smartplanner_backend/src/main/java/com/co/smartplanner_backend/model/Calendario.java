package com.co.smartplanner_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "calendario")
public class Calendario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calendario")
    private Integer idCalendario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "tipo_de_calendario", nullable = false, length = 50)
    private String tipo_de_calendario;

    @Column(name = "color", length = 7, nullable = false) // Ej: "#34a853"
    private String color;

    // Getters y Setters
    public Integer getIdCalendario() { return idCalendario; }
    public void setIdCalendario(Integer idCalendario) { this.idCalendario = idCalendario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipo_de_calendario() { return tipo_de_calendario; }
    public void setTipo_de_calendario(String tipo_de_calendario) {
        this.tipo_de_calendario = tipo_de_calendario;
    }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
