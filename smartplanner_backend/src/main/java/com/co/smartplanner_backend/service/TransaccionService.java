package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.TransaccionDto;
import com.co.smartplanner_backend.model.Transaccion;
import com.co.smartplanner_backend.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransaccionService {

    @Autowired
    private TransaccionRepository repository;

    // Crear
    public TransaccionDto createTransaccion(TransaccionDto dto) {
        Transaccion entity = toEntity(dto);
        Transaccion saved = repository.save(entity);
        return toDto(saved);
    }

    // Listar todas
    public List<TransaccionDto> getAllTransacciones() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    // Buscar por id
    public TransaccionDto getTransaccionById(Long id) {
        Optional<Transaccion> opt = repository.findById(id);
        return opt.map(this::toDto).orElse(null);
    }

    // Actualizar (PUT)
    public TransaccionDto updateTransaccion(Long id, TransaccionDto dto) {
        return repository.findById(id).map(entity -> {
            entity.setMonto(dto.getMonto());
            entity.setDescripcion(dto.getDescripcion());
            entity.setTipo(dto.getTipo());
            entity.setCategoria(dto.getCategoria());
            entity.setFecha(dto.getFecha());
            entity.setId_tarea(dto.getId_tarea());
            entity.setId_usuario(dto.getId_usuario());
            return toDto(repository.save(entity));
        }).orElse(null);
    }

    // Actualización parcial (PATCH)
    public TransaccionDto updatePartialTransaccion(Long id, Map<String, Object> updates) {
        return repository.findById(id).map(entity -> {
            if (updates.containsKey("monto")) entity.setMonto(Double.valueOf(updates.get("monto").toString()));
            if (updates.containsKey("descripcion")) entity.setDescripcion(updates.get("descripcion").toString());
            if (updates.containsKey("tipo")) entity.setTipo(updates.get("tipo").toString());
            if (updates.containsKey("categoria")) entity.setCategoria(updates.get("categoria").toString());
            if (updates.containsKey("fecha")) entity.setFecha(LocalDate.parse(updates.get("fecha").toString()));
            if (updates.containsKey("id_tarea")) entity.setId_tarea(Long.valueOf(updates.get("id_tarea").toString()));
            if (updates.containsKey("id_usuario")) entity.setId_usuario(Integer.valueOf(updates.get("id_usuario").toString()));
            return toDto(repository.save(entity));
        }).orElse(null);
    }

    // Eliminar

public void deleteTransaccion(Long id) {
    Optional<Transaccion> optTransaccion = repository.findById(id);
    if (optTransaccion.isPresent()) {
        Transaccion transaccion = optTransaccion.get();
        // Si está vinculada a una tarea, desvincular
        if (transaccion.getId_tarea() != null) {
            transaccion.setId_tarea(null);
            repository.save(transaccion);
        }
    }
    repository.deleteById(id);
}

    private TransaccionDto toDto(Transaccion entity) {
        TransaccionDto dto = new TransaccionDto();
        dto.setId_gasto(entity.getId_gasto());
        dto.setMonto(entity.getMonto());
        dto.setDescripcion(entity.getDescripcion());
        dto.setTipo(entity.getTipo());
        dto.setCategoria(entity.getCategoria());
        dto.setFecha(entity.getFecha());
        dto.setId_tarea(entity.getId_tarea());
        dto.setId_usuario(entity.getId_usuario());
        return dto;
    }

    private Transaccion toEntity(TransaccionDto dto) {
        Transaccion entity = new Transaccion();
        entity.setId_gasto(dto.getId_gasto());
        entity.setMonto(dto.getMonto());
        entity.setDescripcion(dto.getDescripcion());
        entity.setTipo(dto.getTipo());
        entity.setCategoria(dto.getCategoria());
        entity.setFecha(dto.getFecha());
        entity.setId_tarea(dto.getId_tarea());
        entity.setId_usuario(dto.getId_usuario());
        return entity;
    }

    public List<TransaccionDto> getTransaccionesByUsuario(Integer idUsuario) {
    return repository.findByIdUsuario(idUsuario)
            .stream()
            .map(this::toDto)  // usar el método correcto
            .collect(Collectors.toList());
}


}
