package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.TareaDto;
import com.co.smartplanner_backend.model.Tarea;
import com.co.smartplanner_backend.service.TareaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*") // Permitir peticiones desde el front
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @PostMapping("/crear")
    public ResponseEntity<Tarea> crearTarea(@RequestBody TareaDto tareaDto) {
        return ResponseEntity.ok(tareaService.crearTarea(tareaDto));
    }

    @GetMapping
    public ResponseEntity<List<Tarea>> listarTareas() {
        return ResponseEntity.ok(tareaService.listarTareas());
    }

    // ✅ Obtener tarea por ID (ruta ajustada para evitar conflicto con listado por usuario)
    @GetMapping("/id/{id}")
    public ResponseEntity<Tarea> obtenerTarea(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.obtenerTareaPorId(id));
    }

    // ✅ Listar tareas de un usuario específico (ajustado a /api/tareas/{id_usuario})
    @GetMapping("/{id_usuario}")
public ResponseEntity<List<TareaDto>> listarTareasPorUsuario(@PathVariable("id_usuario") Integer idUsuario) {
    return ResponseEntity.ok(tareaService.listarTareasPorUsuario(idUsuario));
}

    // ✅ Actualizar tarea
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody TareaDto tareaDto) {
        return ResponseEntity.ok(tareaService.actualizarTarea(id, tareaDto));
    }

    // ✅ Eliminar tarea
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        tareaService.eliminarTarea(id);
        return ResponseEntity.noContent().build();
    }
}
