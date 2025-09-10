package com.co.smartplanner_backend.controller;

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
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea tarea) {
        return ResponseEntity.ok(tareaService.crearTarea(tarea));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Tarea>> listarTareas() {
        return ResponseEntity.ok(tareaService.listarTareas());
    }
}
