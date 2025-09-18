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
    private String prioridad;   // baja, media, alta
    private String categoria;   // asociada, sin asociar
    private Integer id_usuario;
}

