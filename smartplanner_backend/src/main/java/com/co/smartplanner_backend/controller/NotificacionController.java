package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.NotificacionDto;
import com.co.smartplanner_backend.model.Notificacion;
import com.co.smartplanner_backend.service.NotificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:5173") // ajusta si usas otro front
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<NotificacionDto>> listarPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(notificacionService.listarPorUsuario(idUsuario));
    }

    @PostMapping("/crear")
    public ResponseEntity<Notificacion> crear(
            @RequestParam Integer idUsuario,
            @RequestParam String titulo,
            @RequestParam String mensaje,
            @RequestParam String tipo
    ) {
        return ResponseEntity.ok(notificacionService.crear(idUsuario, titulo, mensaje, tipo));
    }

    // ✅ Nuevo endpoint para enviar notificación por correo
    @PostMapping("/crear-por-correo")
    public ResponseEntity<Notificacion> crearPorCorreo(
            @RequestParam String correoDestino,
            @RequestParam String titulo,
            @RequestParam String mensaje,
            @RequestParam String tipo
    ) {
        return ResponseEntity.ok(notificacionService.crearPorCorreo(correoDestino, titulo, mensaje, tipo));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Notificacion> marcarLeida(@PathVariable Integer id) {
        return ResponseEntity.ok(notificacionService.marcarLeida(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        notificacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
