package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.CalendarioDto;
import com.co.smartplanner_backend.model.Calendario;
import com.co.smartplanner_backend.service.CalendarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendarios")
@CrossOrigin(origins = "*")
public class CalendarioController {

    @Autowired
    private CalendarioService calendarioService;

    // Crear calendario
    @PostMapping
    public ResponseEntity<?> crearCalendario(@RequestBody CalendarioDto dto) {
        try {
            Calendario calendario = calendarioService.crearCalendario(dto);
            return ResponseEntity.ok(calendario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Calendario>> listarCalendarios() {
        return ResponseEntity.ok(calendarioService.listarCalendarios());
    }
}
