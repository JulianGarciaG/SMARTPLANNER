package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.TareaDto;
import com.co.smartplanner_backend.model.Tarea;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.model.Categoria;
import com.co.smartplanner_backend.model.Prioridad;
import com.co.smartplanner_backend.repository.TareaRepository;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    public TareaService(TareaRepository tareaRepository, UsuarioRepository usuarioRepository) {
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Tarea crearTarea(TareaDto dto) {
        Usuario usuario = usuarioRepository.findById(dto.getId_usuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Tarea tarea = new Tarea();
        tarea.setNombre(dto.getNombre());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setFecha_limite(LocalDateTime.parse(dto.getFecha_limite())); // formato ISO
        tarea.setEstado_de_tarea(dto.getEstado_de_tarea());
        tarea.setPrioridad(Prioridad.valueOf(dto.getPrioridad().toLowerCase()));
        tarea.setCategoria(Categoria.valueOf(dto.getCategoria().toLowerCase()));
        tarea.setUsuario(usuario);

        return tareaRepository.save(tarea);
    }

    public List<Tarea> listarTareas() {
        return tareaRepository.findAll();
    }
}
