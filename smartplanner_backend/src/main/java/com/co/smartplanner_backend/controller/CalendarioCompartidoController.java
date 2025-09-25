package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.CalendarioCompartidoDetalleDto;
import com.co.smartplanner_backend.dto.CalendarioCompartidoDto;
import com.co.smartplanner_backend.model.Calendario;
import com.co.smartplanner_backend.model.CalendarioCompartido;
import com.co.smartplanner_backend.model.CalendarioCompartidoId;
import com.co.smartplanner_backend.model.Permiso;
import com.co.smartplanner_backend.repository.CalendarioCompartidoRepository;
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

    // ✅ GET: Obtener todos los calendarios compartidos de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CalendarioCompartidoDetalleDto>> obtenerCalendariosPorUsuario(@PathVariable Integer idUsuario) {
        List<CalendarioCompartido> compartidos = repository.findByIdIdUsuario(idUsuario);

        List<CalendarioCompartidoDetalleDto> respuesta = compartidos.stream()
                .map(c -> new CalendarioCompartidoDetalleDto(
                        c.getCalendario().getIdCalendario(),
                        c.getCalendario().getNombre(),
                        c.getCalendario().getColor(),
                        c.getPermiso().name() // se devolverá en minúsculas, como en el enum
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }

    // ✅ POST: Crear una relación Calendario_Compartido
    @PostMapping
    public ResponseEntity<?> crearRelacion(@RequestBody CalendarioCompartidoDto dto) {
        try {
            // Crear la clave compuesta
            CalendarioCompartidoId id = new CalendarioCompartidoId(dto.getIdUsuario(), dto.getIdCalendario());

            // Crear entidad
            CalendarioCompartido relacion = new CalendarioCompartido();
            relacion.setId(id);

            // Asignar calendario con solo el id (para evitar null)
            Calendario calendario = new Calendario();
            calendario.setIdCalendario(dto.getIdCalendario());
            relacion.setCalendario(calendario);

            // Normalizar permiso a minúsculas y con "_" en lugar de "-"
            String permisoNormalizado = dto.getPermiso()
                    .toLowerCase()
                    .replace("-", "_");

            relacion.setPermiso(Permiso.valueOf(permisoNormalizado));

            // Guardar en BD
            repository.save(relacion);

            return ResponseEntity.ok("Relación creada con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
