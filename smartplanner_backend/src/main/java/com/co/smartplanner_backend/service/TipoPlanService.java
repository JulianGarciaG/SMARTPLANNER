package com.co.smartplanner_backend.service;



import com.co.smartplanner_backend.model.TIpoPlan;
import com.co.smartplanner_backend.repository.TipoPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoPlanService {

    @Autowired
    private TipoPlanRepository tipoPlanRepository;

    public List<TIpoPlan> findAll() {
        return tipoPlanRepository.findAll();
    }

    public Optional<TIpoPlan> findById(Integer id) {
        return tipoPlanRepository.findById(id);
    }

    public TIpoPlan create(TIpoPlan tipoPlan) {
        return tipoPlanRepository.save(tipoPlan);
    }

    public TIpoPlan update(Integer id, TIpoPlan payload) {
        TIpoPlan existing = tipoPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo plan no encontrado"));
        // Actualiza campos que necesites (ejemplo)
        existing.setNombre(payload.getNombre());
        existing.setDescripcion(payload.getDescripcion());
        existing.setPrecio(payload.getPrecio());
        existing.setPeriodo(payload.getPeriodo());
        existing.setActivo(payload.getActivo());
        // ...otros campos
        return tipoPlanRepository.save(existing);
    }

    public void delete(Integer id) {
        tipoPlanRepository.deleteById(id);
    }
}

