package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.EventoDto;
import com.co.smartplanner_backend.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<EventoDto> crearEvento(@RequestBody EventoDto dto) {
        return ResponseEntity.ok(eventoService.crearEvento(dto));
    }

    @GetMapping("/calendario/{idCalendario}")
    public ResponseEntity<List<EventoDto>> listarEventos(@PathVariable Integer idCalendario) {
        return ResponseEntity.ok(eventoService.listarEventosPorCalendario(idCalendario));
    }

    @GetMapping("/calendario/{idCalendario}/count")
    public ResponseEntity<Long> contarEventos(@PathVariable Integer idCalendario) {
        return ResponseEntity.ok(eventoService.contarEventosPorCalendario(idCalendario));
    }
}
