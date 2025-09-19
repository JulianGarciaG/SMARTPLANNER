package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.CalendarioDto;
import com.co.smartplanner_backend.model.Calendario;
import com.co.smartplanner_backend.repository.CalendarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarioService {

    @Autowired
    private CalendarioRepository calendarioRepository;

    public Calendario crearCalendario(CalendarioDto dto) {
        Calendario calendario = new Calendario();
        calendario.setNombre(dto.getNombre());
        calendario.setTipo_de_calendario(dto.getTipo_de_calendario());
        calendario.setColor(dto.getColor()); // 👈 nuevo
        return calendarioRepository.save(calendario);
    }

    public List<Calendario> listarCalendarios() {
        return calendarioRepository.findAll();
    }
}
