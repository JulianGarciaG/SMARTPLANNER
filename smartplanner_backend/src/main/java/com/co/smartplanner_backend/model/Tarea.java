package com.co.smartplanner_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Tarea")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tarea;

    @Column(nullable = false, length = 80)
    private String nombre;

    private LocalDateTime fecha_limite;

    @Column(length = 255)
    private String descripcion;

    private Boolean estado_de_tarea = false;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Getters y Setters
    public Long getId_tarea() { return id_tarea; }
    public void setId_tarea(Long id_tarea) { this.id_tarea = id_tarea; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDateTime getFecha_limite() { return fecha_limite; }
    public void setFecha_limite(LocalDateTime fecha_limite) { this.fecha_limite = fecha_limite; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Boolean getEstado_de_tarea() { return estado_de_tarea; }
    public void setEstado_de_tarea(Boolean estado_de_tarea) { this.estado_de_tarea = estado_de_tarea; }

    public Prioridad getPrioridad() { return prioridad; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
