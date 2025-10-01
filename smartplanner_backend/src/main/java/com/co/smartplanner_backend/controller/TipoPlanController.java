package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.model.TIpoPlan;
import com.co.smartplanner_backend.service.TipoPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoPlanController {

    @Autowired
    private TipoPlanService tipoPlanService;

    @GetMapping
    public ResponseEntity<List<TIpoPlan>> listar() {
        return ResponseEntity.ok(tipoPlanService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TIpoPlan> obtener(@PathVariable Integer id) {
        return tipoPlanService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TIpoPlan> crear(@RequestBody TIpoPlan payload) {
        TIpoPlan creado = tipoPlanService.create(payload);
        return ResponseEntity.status(201).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TIpoPlan> actualizar(@PathVariable Integer id, @RequestBody TIpoPlan payload) {
        try {
            TIpoPlan actualizado = tipoPlanService.update(id, payload);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        tipoPlanService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
