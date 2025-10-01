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
import java.util.stream.Collectors;

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
tarea.setIdTransaccion(dto.getId_transaccion());
        return tareaRepository.save(tarea);
    }

    public List<Tarea> listarTareas() {
        return tareaRepository.findAll();
    }

     public Tarea obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    // ✅ Listar tareas de un usuario
    public List<TareaDto> listarTareasPorUsuario(Integer idUsuario) {
    List<Tarea> tareas = tareaRepository.findByUsuario_IdUsuario(idUsuario);
    return tareas.stream()
            .map(this::convertirATareaDto)  // Método que convierte Tarea a TareaDto
            .collect(Collectors.toList());
}

// Agregar este método helper
private TareaDto convertirATareaDto(Tarea tarea) {
    TareaDto dto = new TareaDto();
    dto.setId_tarea(tarea.getId_tarea());
    dto.setNombre(tarea.getNombre());
    dto.setDescripcion(tarea.getDescripcion());
    dto.setFecha_limite(tarea.getFecha_limite().toString());
    dto.setEstado_de_tarea(tarea.getEstado_de_tarea());
    dto.setPrioridad(tarea.getPrioridad().toString());
    dto.setCategoria(tarea.getCategoria().toString());
    dto.setId_usuario(tarea.getUsuario().getIdUsuario());
    dto.setId_transaccion(tarea.getIdTransaccion());  // ← ESTA LÍNEA ES CRÍTICA
    return dto;
}

    // ✅ Actualizar
    public Tarea actualizarTarea(Long id, TareaDto dto) {
        Tarea tarea = obtenerTareaPorId(id);

        tarea.setNombre(dto.getNombre());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setFecha_limite(LocalDateTime.parse(dto.getFecha_limite()));
        tarea.setEstado_de_tarea(dto.getEstado_de_tarea());
        tarea.setPrioridad(Prioridad.valueOf(dto.getPrioridad().toLowerCase()));
        tarea.setCategoria(Categoria.valueOf(dto.getCategoria().toLowerCase()));
        tarea.setIdTransaccion(dto.getId_transaccion());
        return tareaRepository.save(tarea);
    }

    // ✅ Eliminar
    public void eliminarTarea(Long id) {
        Tarea tarea = obtenerTareaPorId(id);
        tareaRepository.delete(tarea);
    }
}
