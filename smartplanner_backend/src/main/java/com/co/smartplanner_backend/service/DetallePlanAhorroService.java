package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.DetallePlanAhorroDto;
import com.co.smartplanner_backend.model.DetallePlanAhorro;
import com.co.smartplanner_backend.model.PlanAhorro;
import com.co.smartplanner_backend.repository.DetallePlanAhorroRepository;
import com.co.smartplanner_backend.repository.PlanAhorroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DetallePlanAhorroService {

    @Autowired
    private DetallePlanAhorroRepository detallePlanAhorroRepository;

    @Autowired
    private PlanAhorroRepository planAhorroRepository;

    // Crear nuevo aporte
    public DetallePlanAhorroDto crearAporte(DetallePlanAhorroDto detalleDto) {
        // Validar que existe el plan de ahorro
        Optional<PlanAhorro> planOpt = planAhorroRepository.findById(detalleDto.getIdPlanAhorro());
        if (planOpt.isEmpty()) {
            throw new RuntimeException("Plan de ahorro no encontrado");
        }

        PlanAhorro plan = planOpt.get();

        // Crear la entidad detalle - SIEMPRE con cumplido = false inicialmente
        DetallePlanAhorro detalle = new DetallePlanAhorro();
        detalle.setDescripcion(detalleDto.getDescripcion());
        detalle.setMontoAporte(detalleDto.getMontoAporte());
        detalle.setFechaAporte(detalleDto.getFechaAporte() != null ? 
            detalleDto.getFechaAporte() : LocalDate.now());
        detalle.setCumplido(false); // CAMBIO IMPORTANTE: Siempre false por defecto
        detalle.setPlanAhorro(plan);

        // Guardar el detalle
        DetallePlanAhorro detalleGuardado = detallePlanAhorroRepository.save(detalle);

        // Calcular el total de aportes incluyendo el nuevo
        BigDecimal totalAportes = detallePlanAhorroRepository
            .sumAllMontoAportePorPlan(plan.getIdPlanAhorro());
        
        // Actualizar el monto actual del plan
        plan.setMontoActual(totalAportes);

        // NUEVA LÓGICA: Verificar si se alcanzó la meta y actualizar aportes
        if (plan.getMontoMeta() != null && totalAportes.compareTo(plan.getMontoMeta()) >= 0) {
            // Marcar TODOS los aportes del plan como cumplidos
            List<DetallePlanAhorro> todosLosAportes = detallePlanAhorroRepository
                .findByPlanAhorroIdOrderByFechaAporteDesc(plan.getIdPlanAhorro());
            
            for (DetallePlanAhorro aporte : todosLosAportes) {
                aporte.setCumplido(true);
                detallePlanAhorroRepository.save(aporte);
            }
            
            // Si tienes campo cumplido en Plan_ahorro, descomenta la siguiente línea:
            // plan.setCumplido(true);
        }
        
        planAhorroRepository.save(plan);

        // Obtener el detalle actualizado (por si cambió su estado cumplido)
        DetallePlanAhorro detalleActualizado = detallePlanAhorroRepository.findById(detalleGuardado.getIdDetallePlanAhorro()).get();
        return convertirADto(detalleActualizado);
    }

    // Obtener todos los aportes de un plan
    public List<DetallePlanAhorroDto> obtenerAportesPorPlan(Integer idPlanAhorro) {
        List<DetallePlanAhorro> aportes = detallePlanAhorroRepository
            .findByPlanAhorroIdOrderByFechaAporteDesc(idPlanAhorro);
        return aportes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Obtener solo aportes cumplidos de un plan
    public List<DetallePlanAhorroDto> obtenerAportesCumplidosPorPlan(Integer idPlanAhorro) {
        List<DetallePlanAhorro> aportes = detallePlanAhorroRepository
            .findByPlanAhorroIdAndCumplidoTrueOrderByFechaAporteDesc(idPlanAhorro);
        return aportes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Obtener un aporte específico
    public DetallePlanAhorroDto obtenerAportePorId(Integer idDetalle) {
        Optional<DetallePlanAhorro> aporteOpt = detallePlanAhorroRepository.findById(idDetalle);
        if (aporteOpt.isEmpty()) {
            throw new RuntimeException("Aporte no encontrado");
        }
        return convertirADto(aporteOpt.get());
    }

    // Actualizar aporte existente
    public DetallePlanAhorroDto actualizarAporte(Integer idDetalle, DetallePlanAhorroDto detalleDto) {
        Optional<DetallePlanAhorro> aporteOpt = detallePlanAhorroRepository.findById(idDetalle);
        if (aporteOpt.isEmpty()) {
            throw new RuntimeException("Aporte no encontrado");
        }

        DetallePlanAhorro aporteExistente = aporteOpt.get();
        aporteExistente.setDescripcion(detalleDto.getDescripcion());
        aporteExistente.setMontoAporte(detalleDto.getMontoAporte());
        aporteExistente.setFechaAporte(detalleDto.getFechaAporte());
        // NO permitir cambiar cumplido manualmente - se maneja automáticamente
        // aporteExistente.setCumplido(detalleDto.getCumplido());

        DetallePlanAhorro aporteActualizado = detallePlanAhorroRepository.save(aporteExistente);

        // Recalcular y verificar estado del plan
        verificarYActualizarEstadoPlan(aporteExistente.getPlanAhorro().getIdPlanAhorro());

        return convertirADto(aporteActualizado);
    }

    // Eliminar aporte
    public void eliminarAporte(Integer idDetalle) {
        Optional<DetallePlanAhorro> aporteOpt = detallePlanAhorroRepository.findById(idDetalle);
        if (aporteOpt.isEmpty()) {
            throw new RuntimeException("Aporte no encontrado");
        }

        DetallePlanAhorro aporte = aporteOpt.get();
        Integer idPlan = aporte.getPlanAhorro().getIdPlanAhorro();

        // Eliminar el aporte
        detallePlanAhorroRepository.deleteById(idDetalle);

        // Recalcular y verificar estado del plan
        verificarYActualizarEstadoPlan(idPlan);
    }

    // Cambiar estado de cumplimiento de un aporte - MÉTODO DEPRECADO
    @Deprecated
    public DetallePlanAhorroDto cambiarEstadoCumplimiento(Integer idDetalle, Boolean cumplido) {
        // Este método no debería usarse porque el estado se maneja automáticamente
        throw new RuntimeException("El estado de cumplimiento se maneja automáticamente basado en la meta del plan");
    }

    // Obtener resumen de aportes de un plan
    public ResumenAportesDto obtenerResumenAportes(Integer idPlanAhorro) {
        BigDecimal totalAportes = detallePlanAhorroRepository
            .sumAllMontoAportePorPlan(idPlanAhorro);
        Long cantidadAportes = detallePlanAhorroRepository.countByPlanAhorroId(idPlanAhorro);
        
        return new ResumenAportesDto(totalAportes, cantidadAportes.intValue());
    }

    // NUEVO MÉTODO: Verificar y actualizar estado del plan y aportes
    private void verificarYActualizarEstadoPlan(Integer idPlanAhorro) {
        Optional<PlanAhorro> planOpt = planAhorroRepository.findById(idPlanAhorro);
        if (planOpt.isPresent()) {
            PlanAhorro plan = planOpt.get();
            
            // Calcular total de todos los aportes
            BigDecimal totalAportes = detallePlanAhorroRepository
                .sumAllMontoAportePorPlan(idPlanAhorro);
            
            // Actualizar monto actual
            plan.setMontoActual(totalAportes);
            
            // Obtener todos los aportes
            List<DetallePlanAhorro> todosLosAportes = detallePlanAhorroRepository
                .findByPlanAhorroIdOrderByFechaAporteDesc(idPlanAhorro);
            
            // Verificar si se alcanzó la meta
            boolean metaAlcanzada = plan.getMontoMeta() != null && 
                totalAportes.compareTo(plan.getMontoMeta()) >= 0;
            
            // Actualizar estado de todos los aportes
            for (DetallePlanAhorro aporte : todosLosAportes) {
                aporte.setCumplido(metaAlcanzada);
                detallePlanAhorroRepository.save(aporte);
            }
            
            // Si tienes campo cumplido en Plan_ahorro, descomenta:
            // plan.setCumplido(metaAlcanzada);
            
            planAhorroRepository.save(plan);
        }
    }

    // Método privado para recalcular monto actual del plan - ACTUALIZADO
    private void recalcularMontoActualPlan(Integer idPlanAhorro) {
        verificarYActualizarEstadoPlan(idPlanAhorro);
    }

    // Método auxiliar para convertir entidad a DTO
    private DetallePlanAhorroDto convertirADto(DetallePlanAhorro detalle) {
        DetallePlanAhorroDto dto = new DetallePlanAhorroDto();
        dto.setIdDetallePlanAhorro(detalle.getIdDetallePlanAhorro());
        dto.setDescripcion(detalle.getDescripcion());
        dto.setMontoAporte(detalle.getMontoAporte());
        dto.setFechaAporte(detalle.getFechaAporte());
        dto.setCumplido(detalle.getCumplido());
        dto.setIdPlanAhorro(detalle.getPlanAhorro().getIdPlanAhorro());
        return dto;
    }

    // Clase interna para el resumen de aportes
    public static class ResumenAportesDto {
        private BigDecimal totalAportes;
        private Integer cantidadAportes;

        public ResumenAportesDto(BigDecimal totalAportes, Integer cantidadAportes) {
            this.totalAportes = totalAportes;
            this.cantidadAportes = cantidadAportes;
        }

        // Getters y Setters
        public BigDecimal getTotalAportes() {
            return totalAportes;
        }

        public void setTotalAportes(BigDecimal totalAportes) {
            this.totalAportes = totalAportes;
        }

        public Integer getCantidadAportes() {
            return cantidadAportes;
        }

        public void setCantidadAportes(Integer cantidadAportes) {
            this.cantidadAportes = cantidadAportes;
        }
    }
}