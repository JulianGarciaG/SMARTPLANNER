package com.co.smartplanner_backend.controller;



import com.co.smartplanner_backend.dto.PlanAhorroDto;
import com.co.smartplanner_backend.model.PlanAhorro;
import com.co.smartplanner_backend.service.PlanAhorroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes-ahorro")
public class PlanAhorroController {

    private final PlanAhorroService planAhorroService;

    public PlanAhorroController(PlanAhorroService planAhorroService) {
        this.planAhorroService = planAhorroService;
    }

    @GetMapping
    public ResponseEntity<List<PlanAhorro>> listarPlanes() {
        return ResponseEntity.ok(planAhorroService.listarTodos());
    }


    @PostMapping
    public ResponseEntity<PlanAhorro> crearPlan(@RequestBody PlanAhorro planAhorro) {
        return ResponseEntity.status(201).body(planAhorroService.crear(planAhorro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPlan(@PathVariable Integer id, @RequestBody PlanAhorro planAhorro) {
        try {
            return ResponseEntity.ok(planAhorroService.actualizar(id, planAhorro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Plan no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPlan(@PathVariable Integer id) {
        try {
            planAhorroService.eliminar(id);
            return ResponseEntity.ok("Plan eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Plan no encontrado");
        }
    }
}

