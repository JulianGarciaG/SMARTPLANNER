package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.DetallePlanAhorroDto;
import com.co.smartplanner_backend.service.DetallePlanAhorroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-planes-ahorro")
@CrossOrigin(origins = "*")
public class DetallePlanAhorroController {

    @Autowired
    private DetallePlanAhorroService detallePlanAhorroService;

    // Crear nuevo aporte
    @PostMapping("/crear")
    public ResponseEntity<DetallePlanAhorroDto> crearAporte(@RequestBody DetallePlanAhorroDto detalleDto) {
        try {
            DetallePlanAhorroDto aporteCreado = detallePlanAhorroService.crearAporte(detalleDto);
            return ResponseEntity.ok(aporteCreado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Obtener aportes de un plan específico
    @GetMapping("/plan/{idPlan}")
    public ResponseEntity<List<DetallePlanAhorroDto>> obtenerAportesPorPlan(@PathVariable Integer idPlan) {
        try {
            List<DetallePlanAhorroDto> aportes = detallePlanAhorroService.obtenerAportesPorPlan(idPlan);
            return ResponseEntity.ok(aportes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener solo aportes cumplidos de un plan
    @GetMapping("/plan/{idPlan}/cumplidos")
    public ResponseEntity<List<DetallePlanAhorroDto>> obtenerAportesCumplidos(@PathVariable Integer idPlan) {
        try {
            List<DetallePlanAhorroDto> aportes = detallePlanAhorroService.obtenerAportesCumplidosPorPlan(idPlan);
            return ResponseEntity.ok(aportes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener un aporte específico
    @GetMapping("/{idDetalle}")
    public ResponseEntity<DetallePlanAhorroDto> obtenerAportePorId(@PathVariable Integer idDetalle) {
        try {
            DetallePlanAhorroDto aporte = detallePlanAhorroService.obtenerAportePorId(idDetalle);
            return ResponseEntity.ok(aporte);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar aporte existente
    @PutMapping("/actualizar/{idDetalle}")
    public ResponseEntity<DetallePlanAhorroDto> actualizarAporte(
            @PathVariable Integer idDetalle, 
            @RequestBody DetallePlanAhorroDto detalleDto) {
        try {
            DetallePlanAhorroDto aporteActualizado = detallePlanAhorroService.actualizarAporte(idDetalle, detalleDto);
            return ResponseEntity.ok(aporteActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Eliminar aporte
    @DeleteMapping("/eliminar/{idDetalle}")
    public ResponseEntity<Void> eliminarAporte(@PathVariable Integer idDetalle) {
        try {
            detallePlanAhorroService.eliminarAporte(idDetalle);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cambiar estado de cumplimiento
    @PutMapping("/cambiar-estado/{idDetalle}")
    public ResponseEntity<DetallePlanAhorroDto> cambiarEstadoCumplimiento(
            @PathVariable Integer idDetalle, 
            @RequestBody CambiarEstadoRequest request) {
        try {
            DetallePlanAhorroDto aporteActualizado = detallePlanAhorroService
                .cambiarEstadoCumplimiento(idDetalle, request.getCumplido());
            return ResponseEntity.ok(aporteActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener resumen de aportes
    @GetMapping("/plan/{idPlan}/resumen")
    public ResponseEntity<DetallePlanAhorroService.ResumenAportesDto> obtenerResumenAportes(@PathVariable Integer idPlan) {
        try {
            DetallePlanAhorroService.ResumenAportesDto resumen = detallePlanAhorroService.obtenerResumenAportes(idPlan);
            return ResponseEntity.ok(resumen);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Clase interna para el request de cambiar estado
    public static class CambiarEstadoRequest {
        private Boolean cumplido;

        public Boolean getCumplido() {
            return cumplido;
        }

        public void setCumplido(Boolean cumplido) {
            this.cumplido = cumplido;
        }
    }
}