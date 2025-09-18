package com.co.smartplanner_backend.service;



import com.co.smartplanner_backend.model.PlanAhorro;
import com.co.smartplanner_backend.repository.PlanAhorroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanAhorroService {

    private final PlanAhorroRepository planAhorroRepository;

    public PlanAhorroService(PlanAhorroRepository planAhorroRepository) {
        this.planAhorroRepository = planAhorroRepository;
    }

    public List<PlanAhorro> listarTodos() {
        return planAhorroRepository.findAll();
    }

    public Optional<PlanAhorro> obtenerPorId(Integer id) {
        return planAhorroRepository.findById(id);
    }

    public PlanAhorro crear(PlanAhorro planAhorro) {
        return planAhorroRepository.save(planAhorro);
    }

    public PlanAhorro actualizar(Integer id, PlanAhorro planAhorro) {
        return planAhorroRepository.findById(id)
                .map(existing -> {
                    existing.setNombrePlan(planAhorro.getNombrePlan());
                    existing.setMontoActual(planAhorro.getMontoActual());
                    existing.setMontoMeta(planAhorro.getMontoMeta());
                    existing.setFechaFin(planAhorro.getFechaFin());
                    existing.setUsuario(planAhorro.getUsuario());
                    return planAhorroRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public void eliminar(Integer id) {
        if (!planAhorroRepository.existsById(id)) {
            throw new RuntimeException("Plan no encontrado");
        }
        planAhorroRepository.deleteById(id);
    }
}

