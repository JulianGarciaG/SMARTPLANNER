package com.co.smartplanner_backend.controller;


import com.co.smartplanner_backend.model.Suscripcion;
import com.co.smartplanner_backend.model.TIpoPlan;
import com.co.smartplanner_backend.repository.TipoPlanRepository;
import com.co.smartplanner_backend.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suscripciones")
@CrossOrigin(origins = "*")
public class SuscripcionController {

    @Autowired
    private TipoPlanRepository tipoPlanRepository;

    @Autowired
    private SuscripcionService suscripcionService;

    @GetMapping
    public ResponseEntity<List<Suscripcion>> listar() {
        return ResponseEntity.ok(suscripcionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Suscripcion> obtener(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(suscripcionService.findById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Suscripcion>> porUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(suscripcionService.findByUsuario(idUsuario));
    }

    // Crear suscripción: cuerpo mínimo o params
@PostMapping
public ResponseEntity<?> crear(@RequestBody Map<String, Object> payload) {
    try {
        Integer idUsuario = (Integer) payload.get("idUsuario");
        Integer idTipoPlan = (Integer) payload.get("idPlan");
        String metodoPago = (String) payload.get("metodoPago");
        
        if (idUsuario == null || idTipoPlan == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan datos requeridos"));
        }
        
        // ✅ IMPORTANTE: Cancelar todas las suscripciones activas anteriores
        List<Suscripcion> suscripcionesActivas = suscripcionService.findByUsuario(idUsuario)
            .stream()
            .filter(s -> s.getEstado() == Suscripcion.EstadoSuscripcion.activa)
            .toList();
            
        for (Suscripcion s : suscripcionesActivas) {
            s.setEstado(Suscripcion.EstadoSuscripcion.cancelada);
            suscripcionService.update(s.getIdSuscripcion(), s);
        }
        
        LocalDate fechaInicio = LocalDate.now();
        LocalDate fechaFin = fechaInicio.plusMonths(1);
        
        Suscripcion nueva = suscripcionService.create(
            idUsuario, 
            idTipoPlan, 
            fechaInicio, 
            fechaFin, 
            Suscripcion.EstadoSuscripcion.activa, 
            metodoPago
        );
        
        return ResponseEntity.status(201).body(nueva);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

@GetMapping("/usuario/{idUsuario}/activa")
public ResponseEntity<?> obtenerSuscripcionActiva(@PathVariable Integer idUsuario) {
    try {
        List<Suscripcion> suscripciones = suscripcionService.findByUsuario(idUsuario);
        
        // Buscar la suscripción activa
        Suscripcion activa = suscripciones.stream()
            .filter(s -> s.getEstado() == Suscripcion.EstadoSuscripcion.activa)
            .findFirst()
            .orElse(null);
            
        if (activa == null) {
            return ResponseEntity.status(404).body(Map.of("error", "No hay suscripción activa"));
        }
        
        // Obtener información del plan
        TIpoPlan tipoPlan = tipoPlanRepository.findById(activa.getIdTipoPlan())
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        
        // Construir respuesta con toda la información
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("idTipoPlan", activa.getIdTipoPlan());
        respuesta.put("nombrePlan", tipoPlan.getNombre());
        respuesta.put("precio", activa.getPrecioPagado());
        respuesta.put("fechaInicio", activa.getFechaInicio());
        respuesta.put("fechaFin", activa.getFechaFin());
        respuesta.put("estado", activa.getEstado());
        
        return ResponseEntity.ok(respuesta);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Suscripcion> cancelar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(suscripcionService.cancel(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Suscripcion> actualizar(@PathVariable Integer id, @RequestBody Suscripcion payload) {
        try {
            return ResponseEntity.ok(suscripcionService.update(id, payload));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        suscripcionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
