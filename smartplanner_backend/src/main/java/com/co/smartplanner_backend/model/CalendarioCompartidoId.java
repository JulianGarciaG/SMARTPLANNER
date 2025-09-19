package com.co.smartplanner_backend.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CalendarioCompartidoId implements Serializable {

    private Integer idUsuario;
    private Integer idCalendario;

    public CalendarioCompartidoId() {}

    public CalendarioCompartidoId(Integer idUsuario, Integer idCalendario) {
        this.idUsuario = idUsuario;
        this.idCalendario = idCalendario;
    }

    // Getters y Setters
    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdCalendario() {
        return idCalendario;
    }

    public void setIdCalendario(Integer idCalendario) {
        this.idCalendario = idCalendario;
    }

    // equals y hashCode (OBLIGATORIO para claves compuestas)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CalendarioCompartidoId)) return false;
        CalendarioCompartidoId that = (CalendarioCompartidoId) o;
        return Objects.equals(idUsuario, that.idUsuario) &&
               Objects.equals(idCalendario, that.idCalendario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, idCalendario);
    }
}
