package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.EventoDto;
import com.co.smartplanner_backend.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    /**
     * Crear un nuevo evento
     */
    @PostMapping
    public ResponseEntity<EventoDto> crearEvento(@RequestBody EventoDto dto) {
        try {
            EventoDto nuevoEvento = eventoService.crearEvento(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEvento);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Listar eventos de un calendario
     */
    @GetMapping("/calendario/{idCalendario}")
    public ResponseEntity<List<EventoDto>> listarEventos(@PathVariable Integer idCalendario) {
        try {
            List<EventoDto> eventos = eventoService.listarEventosPorCalendario(idCalendario);
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Contar eventos de un calendario
     */
    @GetMapping("/calendario/{idCalendario}/count")
    public ResponseEntity<Long> contarEventos(@PathVariable Integer idCalendario) {
        try {
            long count = eventoService.contarEventosPorCalendario(idCalendario);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    /**
     * ✨ Obtener un evento por ID
     */
    @GetMapping("/{idEvento}")
    public ResponseEntity<EventoDto> obtenerEventoPorId(@PathVariable Integer idEvento) {
        try {
            EventoDto evento = eventoService.obtenerEventoPorId(idEvento);
            return ResponseEntity.ok(evento);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * ✨ Actualizar un evento
     */
    @PutMapping("/{idEvento}")
    public ResponseEntity<EventoDto> actualizarEvento(
            @PathVariable Integer idEvento,
            @RequestBody EventoDto dto) {
        try {
            EventoDto eventoActualizado = eventoService.actualizarEvento(idEvento, dto);
            return ResponseEntity.ok(eventoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * ✨ Eliminar un evento
     */
    @DeleteMapping("/{idEvento}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Integer idEvento) {
        try {
            eventoService.eliminarEvento(idEvento);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}