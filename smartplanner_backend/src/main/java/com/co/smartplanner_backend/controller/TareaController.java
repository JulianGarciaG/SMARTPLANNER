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
}
