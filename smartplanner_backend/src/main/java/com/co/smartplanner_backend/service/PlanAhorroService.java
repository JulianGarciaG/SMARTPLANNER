package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.PlanAhorroDto;
import com.co.smartplanner_backend.model.PlanAhorro;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.repository.PlanAhorroRepository;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanAhorroService {

    @Autowired
    private PlanAhorroRepository planAhorroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los planes de ahorro de un usuario
    public List<PlanAhorroDto> obtenerPlanesPorUsuario(Integer idUsuario) {
        List<PlanAhorro> planes = planAhorroRepository.findByUsuarioId(idUsuario);
        return planes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Crear nuevo plan de ahorro
    public PlanAhorroDto crearPlanAhorro(PlanAhorroDto planAhorroDto) {
        // Buscar el usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(planAhorroDto.getIdUsuario());
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        // Crear la entidad
        PlanAhorro planAhorro = new PlanAhorro();
        planAhorro.setNombrePlan(planAhorroDto.getNombrePlan());
        planAhorro.setMontoActual(planAhorroDto.getMontoActual() != null ? 
            planAhorroDto.getMontoActual() : BigDecimal.ZERO);
        planAhorro.setMontoMeta(planAhorroDto.getMontoMeta());
        planAhorro.setFechaFin(planAhorroDto.getFechaFin());
        planAhorro.setUsuario(usuarioOpt.get());

        // Guardar
        PlanAhorro planGuardado = planAhorroRepository.save(planAhorro);
        return convertirADto(planGuardado);
    }

    // Actualizar plan de ahorro existente
    public PlanAhorroDto actualizarPlanAhorro(Integer idPlan, PlanAhorroDto planAhorroDto) {
        Optional<PlanAhorro> planOpt = planAhorroRepository.findById(idPlan);
        if (planOpt.isEmpty()) {
            throw new RuntimeException("Plan de ahorro no encontrado");
        }

        PlanAhorro planExistente = planOpt.get();
        planExistente.setNombrePlan(planAhorroDto.getNombrePlan());
        planExistente.setMontoActual(planAhorroDto.getMontoActual());
        planExistente.setMontoMeta(planAhorroDto.getMontoMeta());
        planExistente.setFechaFin(planAhorroDto.getFechaFin());

        PlanAhorro planActualizado = planAhorroRepository.save(planExistente);
        return convertirADto(planActualizado);
    }

    // Actualizar solo el monto actual (para cuando se añade dinero al plan)
    public PlanAhorroDto actualizarMontoActual(Integer idPlan, BigDecimal nuevoMonto) {
        Optional<PlanAhorro> planOpt = planAhorroRepository.findById(idPlan);
        if (planOpt.isEmpty()) {
            throw new RuntimeException("Plan de ahorro no encontrado");
        }

        PlanAhorro plan = planOpt.get();
        plan.setMontoActual(nuevoMonto);

        PlanAhorro planActualizado = planAhorroRepository.save(plan);
        return convertirADto(planActualizado);
    }

    // Eliminar plan de ahorro
    public void eliminarPlanAhorro(Integer idPlan) {
        if (!planAhorroRepository.existsById(idPlan)) {
            throw new RuntimeException("Plan de ahorro no encontrado");
        }
        planAhorroRepository.deleteById(idPlan);
    }

    // Obtener un plan específico
    public PlanAhorroDto obtenerPlanPorId(Integer idPlan) {
        Optional<PlanAhorro> planOpt = planAhorroRepository.findById(idPlan);
        if (planOpt.isEmpty()) {
            throw new RuntimeException("Plan de ahorro no encontrado");
        }
        return convertirADto(planOpt.get());
    }

    // Obtener planes activos de un usuario
    public List<PlanAhorroDto> obtenerPlanesActivos(Integer idUsuario) {
        List<PlanAhorro> planes = planAhorroRepository.findActiveByUsuarioId(idUsuario);
        return planes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Obtener planes completados de un usuario
    public List<PlanAhorroDto> obtenerPlanesCompletados(Integer idUsuario) {
        List<PlanAhorro> planes = planAhorroRepository.findCompletedByUsuarioId(idUsuario);
        return planes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Método auxiliar para convertir entidad a DTO
    private PlanAhorroDto convertirADto(PlanAhorro planAhorro) {
        PlanAhorroDto dto = new PlanAhorroDto();
        dto.setIdPlanAhorro(planAhorro.getIdPlanAhorro());
        dto.setNombrePlan(planAhorro.getNombrePlan());
        dto.setMontoActual(planAhorro.getMontoActual());
        dto.setMontoMeta(planAhorro.getMontoMeta());
        dto.setFechaFin(planAhorro.getFechaFin());
        dto.setIdUsuario(planAhorro.getUsuario().getIdUsuario());
        return dto;
    }
}