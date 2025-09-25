package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.PlanAhorroDto;
import com.co.smartplanner_backend.service.PlanAhorroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/planes-ahorro")
@CrossOrigin(origins = "*")
public class PlanAhorroController {

    @Autowired
    private PlanAhorroService planAhorroService;

    // Obtener todos los planes de ahorro de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<PlanAhorroDto>> obtenerPlanesPorUsuario(@PathVariable Integer idUsuario) {
        try {
            List<PlanAhorroDto> planes = planAhorroService.obtenerPlanesPorUsuario(idUsuario);
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener un plan específico por ID
    @GetMapping("/{idPlan}")
    public ResponseEntity<PlanAhorroDto> obtenerPlanPorId(@PathVariable Integer idPlan) {
        try {
            PlanAhorroDto plan = planAhorroService.obtenerPlanPorId(idPlan);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Crear nuevo plan de ahorro
    @PostMapping("/crear")
    public ResponseEntity<PlanAhorroDto> crearPlanAhorro(@RequestBody PlanAhorroDto planAhorroDto) {
        try {
            PlanAhorroDto planCreado = planAhorroService.crearPlanAhorro(planAhorroDto);
            return ResponseEntity.ok(planCreado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Actualizar plan de ahorro completo
    @PutMapping("/actualizar/{idPlan}")
    public ResponseEntity<PlanAhorroDto> actualizarPlanAhorro(
            @PathVariable Integer idPlan, 
            @RequestBody PlanAhorroDto planAhorroDto) {
        try {
            PlanAhorroDto planActualizado = planAhorroService.actualizarPlanAhorro(idPlan, planAhorroDto);
            return ResponseEntity.ok(planActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar solo el monto actual de un plan
    @PutMapping("/actualizar-monto/{idPlan}")
    public ResponseEntity<PlanAhorroDto> actualizarMontoActual(
            @PathVariable Integer idPlan, 
            @RequestBody MontoActualizacionRequest request) {
        try {
            PlanAhorroDto planActualizado = planAhorroService.actualizarMontoActual(idPlan, request.getNuevoMonto());
            return ResponseEntity.ok(planActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Eliminar plan de ahorro
    @DeleteMapping("/eliminar/{idPlan}")
    public ResponseEntity<Void> eliminarPlanAhorro(@PathVariable Integer idPlan) {
        try {
            planAhorroService.eliminarPlanAhorro(idPlan);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener planes activos de un usuario
    @GetMapping("/usuario/{idUsuario}/activos")
    public ResponseEntity<List<PlanAhorroDto>> obtenerPlanesActivos(@PathVariable Integer idUsuario) {
        try {
            List<PlanAhorroDto> planes = planAhorroService.obtenerPlanesActivos(idUsuario);
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Obtener planes completados de un usuario
    @GetMapping("/usuario/{idUsuario}/completados")
    public ResponseEntity<List<PlanAhorroDto>> obtenerPlanesCompletados(@PathVariable Integer idUsuario) {
        try {
            List<PlanAhorroDto> planes = planAhorroService.obtenerPlanesCompletados(idUsuario);
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Clase interna para el request de actualización de monto
    public static class MontoActualizacionRequest {
        private BigDecimal nuevoMonto;

        public BigDecimal getNuevoMonto() {
            return nuevoMonto;
        }

        public void setNuevoMonto(BigDecimal nuevoMonto) {
            this.nuevoMonto = nuevoMonto;
        }
    }
}