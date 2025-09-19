package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.CalendarioCompartidoDto;
import com.co.smartplanner_backend.model.CalendarioCompartido;
import com.co.smartplanner_backend.service.CalendarioCompartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendarios-compartidos")
@CrossOrigin(origins = "*")
public class CalendarioCompartidoController {

    @Autowired
    private CalendarioCompartidoService service;

    // Crear relación usuario-calendario
    @PostMapping
    public ResponseEntity<?> compartirCalendario(@RequestBody CalendarioCompartidoDto dto) {
        try {
            CalendarioCompartido cc = service.compartirCalendario(dto);
            return ResponseEntity.ok(cc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Listar todos los calendarios compartidos de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CalendarioCompartido>> obtenerCalendariosPorUsuario(
            @PathVariable Integer idUsuario) {
        return ResponseEntity.ok(service.obtenerCalendariosPorUsuario(idUsuario));
    }

    // Eliminar relación (dejar de compartir un calendario con un usuario)
    @DeleteMapping("/{idUsuario}/{idCalendario}")
    public ResponseEntity<?> eliminarCompartido(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idCalendario) {
        service.eliminarCompartido(idUsuario, idCalendario);
        return ResponseEntity.ok("Relación eliminada correctamente");
    }
}
