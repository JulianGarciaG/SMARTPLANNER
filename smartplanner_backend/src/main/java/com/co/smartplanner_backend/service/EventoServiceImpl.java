package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.EventoDto;
import com.co.smartplanner_backend.model.Calendario;
import com.co.smartplanner_backend.model.Evento;
import com.co.smartplanner_backend.repository.CalendarioRepository;
import com.co.smartplanner_backend.repository.EventoRepository;
import com.co.smartplanner_backend.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoServiceImpl implements EventoService {

        @Autowired
        private EventoRepository eventoRepository;

        @Autowired
        private CalendarioRepository calendarioRepository;

        @Override
        @Transactional
        public EventoDto crearEvento(EventoDto dto) {
                Calendario calendario = calendarioRepository.findById(dto.getIdCalendario())
                                .orElseThrow(() -> new RuntimeException("Calendario no encontrado"));

                Evento evento = new Evento();
                evento.setNombre(dto.getNombre());
                evento.setDescripcion(dto.getDescripcion());
                evento.setFechaInicio(dto.getFechaInicio());
                evento.setFechaFin(dto.getFechaFin());
                evento.setLugar(dto.getLugar());
                evento.setCalendario(calendario);

                Evento guardado = eventoRepository.save(evento);
                return convertirADto(guardado);
        }

        @Override
        public List<EventoDto> listarEventosPorCalendario(Integer idCalendario) {
                List<Evento> eventos = eventoRepository.findByCalendarioIdCalendario(idCalendario);
                return eventos.stream()
                                .map(this::convertirADto)
                                .collect(Collectors.toList());
        }

        @Override
        public long contarEventosPorCalendario(Integer idCalendario) {
                return eventoRepository.countByCalendarioIdCalendario(idCalendario);
        }

        @Override
        public EventoDto obtenerEventoPorId(Integer idEvento) {
                Evento evento = eventoRepository.findById(idEvento)
                                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + idEvento));
                return convertirADto(evento);
        }

        @Override
        @Transactional
        public EventoDto actualizarEvento(Integer idEvento, EventoDto dto) {
                Evento evento = eventoRepository.findById(idEvento)
                                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + idEvento));

                // Actualizar campos
                evento.setNombre(dto.getNombre());
                evento.setDescripcion(dto.getDescripcion());
                evento.setFechaInicio(dto.getFechaInicio());
                evento.setFechaFin(dto.getFechaFin());
                evento.setLugar(dto.getLugar());

                // Si se cambia el calendario
                if (dto.getIdCalendario() != null
                                && !dto.getIdCalendario().equals(evento.getCalendario().getIdCalendario())) {
                        Calendario nuevoCalendario = calendarioRepository.findById(dto.getIdCalendario())
                                        .orElseThrow(() -> new RuntimeException("Calendario no encontrado"));
                        evento.setCalendario(nuevoCalendario);
                }

                Evento actualizado = eventoRepository.save(evento);
                return convertirADto(actualizado);
        }

        @Override
        @Transactional
        public void eliminarEvento(Integer idEvento) {
                if (!eventoRepository.existsById(idEvento)) {
                        throw new RuntimeException("Evento no encontrado con ID: " + idEvento);
                }
                eventoRepository.deleteById(idEvento);
        }

        // Método auxiliar para convertir entidad a DTO
        private EventoDto convertirADto(Evento evento) {
                EventoDto dto = new EventoDto();
                dto.setIdEvento(evento.getIdEvento());
                dto.setNombre(evento.getNombre());
                dto.setDescripcion(evento.getDescripcion());
                dto.setFechaInicio(evento.getFechaInicio());
                dto.setFechaFin(evento.getFechaFin());
                dto.setLugar(evento.getLugar());
                dto.setIdCalendario(evento.getCalendario().getIdCalendario());
                return dto;
        }
}