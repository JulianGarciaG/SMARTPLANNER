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

    // Relación con Calendario
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCalendario") // Vincula con la clave compuesta
    @JoinColumn(name = "id_calendario", insertable = false, updatable = false)
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

    public Calendario getCalendario() {
        return calendario;
    }

    public void setCalendario(Calendario calendario) {
        this.calendario = calendario;
    }
}
