package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.model.CalendarioCompartido;
import com.co.smartplanner_backend.model.CalendarioCompartidoId;
import com.co.smartplanner_backend.model.Permiso;
import com.co.smartplanner_backend.dto.CalendarioCompartidoDto;
import com.co.smartplanner_backend.repository.CalendarioCompartidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarioCompartidoService {

    private final CalendarioCompartidoRepository repository;

    public CalendarioCompartidoService(CalendarioCompartidoRepository repository) {
        this.repository = repository;
    }

    // Crear relación usuario-calendario
    public CalendarioCompartido compartirCalendario(CalendarioCompartidoDto dto) {
        CalendarioCompartido cc = new CalendarioCompartido();

        // Usamos el ID compuesto
        CalendarioCompartidoId id = new CalendarioCompartidoId(dto.getIdUsuario(), dto.getIdCalendario());
        cc.setId(id);

        // Normalizamos el permiso recibido: null -> "no-compartido", "-" -> "_", lowercase
        String permisoRecibido = dto.getPermiso();
        if (permisoRecibido == null) permisoRecibido = "no-compartido";
        String permisoNormalizado = permisoRecibido.toLowerCase().replace("-", "_");

        // Intentamos mapear al enum; si falla, por seguridad usamos NO_COMPARTIDO
        Permiso permisoEnum;
        try {
            permisoEnum = Permiso.valueOf(permisoNormalizado);
        } catch (IllegalArgumentException ex) {
            permisoEnum = Permiso.no_compartido;
        }

        cc.setPermiso(permisoEnum);

        return repository.save(cc);
    }

    // Listar todos los calendarios compartidos de un usuario
    public List<CalendarioCompartido> obtenerCalendariosPorUsuario(Integer idUsuario) {
        return repository.findByIdIdUsuario(idUsuario);
    }

    // Eliminar relación (dejar de compartir un calendario con un usuario)
    public void eliminarCompartido(Integer idUsuario, Integer idCalendario) {
        CalendarioCompartidoId id = new CalendarioCompartidoId(idUsuario, idCalendario);
        repository.deleteById(id);
    }
}
