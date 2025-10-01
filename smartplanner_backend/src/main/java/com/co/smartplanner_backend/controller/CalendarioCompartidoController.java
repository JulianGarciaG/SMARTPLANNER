package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.CalendarioCompartidoDetalleDto;
import com.co.smartplanner_backend.dto.CalendarioCompartidoDto;
import com.co.smartplanner_backend.model.*;
import com.co.smartplanner_backend.repository.CalendarioCompartidoRepository;
import com.co.smartplanner_backend.service.CalendarioCompartidoService;
import com.co.smartplanner_backend.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendarios-compartidos")
@CrossOrigin(origins = "*")
public class CalendarioCompartidoController {

    @Autowired
    private CalendarioCompartidoRepository repository;

    @Autowired
    private CalendarioCompartidoService service;

    @Autowired
    private NotificacionService notificacionService;

    // GET: Obtener todos los calendarios compartidos de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CalendarioCompartidoDetalleDto>> obtenerCalendariosPorUsuario(@PathVariable Integer idUsuario) {
        List<CalendarioCompartido> compartidos = service.obtenerCalendariosPorUsuario(idUsuario);

        List<CalendarioCompartidoDetalleDto> respuesta = compartidos.stream()
                .map(c -> new CalendarioCompartidoDetalleDto(
                        c.getCalendario().getIdCalendario(),
                        c.getCalendario().getNombre(),
                        c.getCalendario().getColor(),
                        c.getPermiso().name()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    /**
     * POST: Crear relación Calendario_Compartido.
     * - Si DTO trae "correo": se busca ese usuario y se comparte (y se envía notificación local).
     * - Si no trae correo pero trae idUsuario: vincula ese usuario (ej: propietario/personal).
     */
    @PostMapping
    public ResponseEntity<?> crearRelacion(@RequestBody CalendarioCompartidoDto dto) {
        try {
            CalendarioCompartido guardado = service.compartirCalendario(dto);

            // Si la petición vino con correo -> notificar al usuario invitado
            if (dto.getCorreo() != null && !dto.getCorreo().isBlank()) {
                String titulo = "Nuevo calendario compartido";
                String permiso = dto.getPermiso() != null ? dto.getPermiso() : "ver";
                String mensaje = "Se te ha compartido el calendario '" + guardado.getCalendario().getNombre()
                        + "' con permiso: " + permiso;

                // Mantén el tipo en minúsculas (como tu BD lo guarda)
                String tipo = "alerta";

                notificacionService.crear(
                        guardado.getUsuario().getIdUsuario(),
                        titulo,
                        mensaje,
                        tipo
                );
            }

            return ResponseEntity.ok("Relación creada con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
