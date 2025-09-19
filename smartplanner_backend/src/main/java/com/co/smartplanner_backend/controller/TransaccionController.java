package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.TransaccionDto;
import com.co.smartplanner_backend.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = "*") // Permite peticiones desde el front
public class TransaccionController {

    @Autowired
    private TransaccionService service;

    @PostMapping
    public ResponseEntity<TransaccionDto> create(@RequestBody TransaccionDto dto) {
        return ResponseEntity.ok(service.createTransaccion(dto));
    }

    @GetMapping
    public ResponseEntity<List<TransaccionDto>> getAll() {
        return ResponseEntity.ok(service.getAllTransacciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransaccionDto> getById(@PathVariable Long id) {
        TransaccionDto dto = service.getTransaccionById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransaccionDto> update(@PathVariable Long id, @RequestBody TransaccionDto dto) {
        TransaccionDto updated = service.updateTransaccion(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransaccionDto> updatePartial(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        TransaccionDto updated = service.updatePartialTransaccion(id, updates);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTransaccion(id);
        return ResponseEntity.noContent().build();
    }
}
