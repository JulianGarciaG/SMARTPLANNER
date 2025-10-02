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
        calendario.setColor(dto.getColor()); // 👈 guardar color
        return calendarioRepository.save(calendario);
    }

    public List<Calendario> listarCalendarios() {
        return calendarioRepository.findAll();
    }

    // Editar calendario
    public Calendario editarCalendario(Integer id, CalendarioDto dto) {
        Calendario calendario = calendarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calendario no encontrado"));

        calendario.setNombre(dto.getNombre());
        calendario.setTipo_de_calendario(dto.getTipo_de_calendario());
        calendario.setColor(dto.getColor());

        return calendarioRepository.save(calendario);
    }

    // Eliminar calendario
    public void eliminarCalendario(Integer id) {
        if (!calendarioRepository.existsById(id)) {
            throw new RuntimeException("Calendario no encontrado");
        }
        calendarioRepository.deleteById(id);
    }
}
