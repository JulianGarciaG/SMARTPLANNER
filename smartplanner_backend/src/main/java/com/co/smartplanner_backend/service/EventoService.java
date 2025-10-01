package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.EventoDto;

import java.util.List;

public interface EventoService {
    EventoDto crearEvento(EventoDto dto);
    List<EventoDto> listarEventosPorCalendario(Integer idCalendario);

    long contarEventosPorCalendario(Integer idCalendario);
}
