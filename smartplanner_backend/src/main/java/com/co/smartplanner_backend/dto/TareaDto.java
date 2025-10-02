package com.co.smartplanner_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TareaDto {
    private String nombre;
    private String descripcion;
    private String fecha_limite;
    private Boolean estado_de_tarea;
    private String prioridad;  
    private String categoria; 
    private Integer id_usuario;
    private Long id_transaccion;
    private Long id_tarea;

public Long getId_tarea() {
    return id_tarea;
}

public void setId_tarea(Long id_tarea) {
    this.id_tarea = id_tarea;
}

public Long getId_transaccion() { return id_transaccion; }
public void setId_transaccion(Long id_transaccion) { this.id_transaccion = id_transaccion; }
}

