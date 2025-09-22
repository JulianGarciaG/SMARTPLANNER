package com.co.smartplanner_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Transaccion")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_gasto;

    private Double monto;
    private String descripcion;

    @Column(nullable = false)
    private String tipo; // ingreso o egreso

    private String categoria;

    private LocalDate fecha;

    private Long id_tarea;

    private Integer id_usuario;

    // Getters y Setters
    public Long getId_gasto() {
        return id_gasto;
    }
    public void setId_gasto(Long id_gasto) {
        this.id_gasto = id_gasto;
    }

    public Double getMonto() {
        return monto;
    }
    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getId_tarea() {
        return id_tarea;
    }
    public void setId_tarea(Long id_tarea) {
        this.id_tarea = id_tarea;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }
    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }
}
