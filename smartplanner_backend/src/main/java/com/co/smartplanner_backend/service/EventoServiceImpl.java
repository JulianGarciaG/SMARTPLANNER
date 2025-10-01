package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.EventoDto;
import com.co.smartplanner_backend.model.Calendario;
import com.co.smartplanner_backend.model.Evento;
import com.co.smartplanner_backend.repository.CalendarioRepository;
import com.co.smartplanner_backend.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoServiceImpl implements EventoService {

        @Autowired
        private EventoRepository eventoRepository;

        @Autowired
        private CalendarioRepository calendarioRepository;

        @Override
        public EventoDto crearEvento(EventoDto dto) {
                Calendario calendario = calendarioRepository.findById(dto.getIdCalendario())
                        .orElseThrow(() -> new RuntimeException("Calendario no encontrado"));

                Evento evento = new Evento();
                evento.setNombre(dto.getNombre());
                evento.setDescripcion(dto.getDescripcion());
                evento.setLugar(dto.getLugar());
                evento.setFechaInicio(dto.getFechaInicio());
                evento.setFechaFin(dto.getFechaFin());
                evento.setCalendario(calendario);

                Evento guardado = eventoRepository.save(evento);

                return new EventoDto(
                        guardado.getIdEvento(),
                        guardado.getNombre(),
                        guardado.getDescripcion(),
                        guardado.getLugar(),
                        guardado.getFechaInicio(),
                        guardado.getFechaFin(),
                        guardado.getCalendario().getIdCalendario()
                );
        }

        @Override
        public List<EventoDto> listarEventosPorCalendario(Integer idCalendario) {
                return eventoRepository.findByCalendarioIdCalendario(idCalendario)
                        .stream()
                        .map(e -> new EventoDto(
                                e.getIdEvento(),
                                e.getNombre(),
                                e.getDescripcion(),
                                e.getLugar(),
                                e.getFechaInicio(),
                                e.getFechaFin(),
                                e.getCalendario().getIdCalendario()
                        ))
                        .collect(Collectors.toList());
        }

        @Override
        public long contarEventosPorCalendario(Integer idCalendario) {
                return eventoRepository.countByCalendarioIdCalendario(idCalendario);
        }
}
