package com.co.smartplanner_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Calendario_Compartido")
public class CalendarioCompartido {

    @EmbeddedId
    private CalendarioCompartidoId id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permiso permiso;

    // Relación con Usuario (mapeada a la parte idUsuario del EmbeddedId)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relación con Calendario (mapeada a la parte idCalendario del EmbeddedId)
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCalendario")
    @JoinColumn(name = "id_calendario", nullable = false)
    private Calendario calendario;

    // Getters y Setters
    public CalendarioCompartidoId getId() {
        return id;
    }

    public void setId(CalendarioCompartidoId id) {
        this.id = id;
    }

    public Permiso getPermiso() {
        return permiso;
    }

    public void setPermiso(Permiso permiso) {
        this.permiso = permiso;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Calendario getCalendario() {
        return calendario;
    }

    public void setCalendario(Calendario calendario) {
        this.calendario = calendario;
    }
}
