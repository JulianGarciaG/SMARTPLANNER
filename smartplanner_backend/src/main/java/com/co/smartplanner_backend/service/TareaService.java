package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.model.Tarea;
import com.co.smartplanner_backend.repository.TareaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    public Tarea crearTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    public List<Tarea> listarTareas() {
        return tareaRepository.findAll();
    }
}
