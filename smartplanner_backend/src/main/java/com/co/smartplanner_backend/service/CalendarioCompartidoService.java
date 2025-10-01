package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.CalendarioCompartidoDto;
import com.co.smartplanner_backend.model.*;
import com.co.smartplanner_backend.repository.CalendarioCompartidoRepository;
import com.co.smartplanner_backend.repository.CalendarioRepository;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarioCompartidoService {

    private final CalendarioCompartidoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CalendarioRepository calendarioRepository;

    public CalendarioCompartidoService(CalendarioCompartidoRepository repository,
                                       UsuarioRepository usuarioRepository,
                                       CalendarioRepository calendarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.calendarioRepository = calendarioRepository;
    }

    /**
     * Crea la relación Calendario_Compartido.
     * - Si dto.getCorreo() está presente: busca el usuario por correo y lo comparte con él.
     * - Si dto.getIdUsuario() está presente (y no se pasó correo): vincula ese usuario (ej: el creador).
     */
    public CalendarioCompartido compartirCalendario(CalendarioCompartidoDto dto) {
        // validar calendario
        Integer idCalendario = dto.getIdCalendario();
        if (idCalendario == null) {
            throw new RuntimeException("idCalendario es obligatorio");
        }
        Calendario calendario = calendarioRepository.findById(idCalendario)
                .orElseThrow(() -> new RuntimeException("Calendario no encontrado con id " + idCalendario));

        // determinar usuario destino
        Usuario usuarioDestino = null;
        if (dto.getCorreo() != null && !dto.getCorreo().isBlank()) {
            usuarioDestino = usuarioRepository.findByCorreoElectronico(dto.getCorreo())
                    .orElseThrow(() -> new RuntimeException("Usuario con correo " + dto.getCorreo() + " no encontrado"));
        } else if (dto.getIdUsuario() != null) {
            usuarioDestino = usuarioRepository.findById(dto.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario con id " + dto.getIdUsuario() + " no encontrado"));
        } else {
            throw new RuntimeException("Se requiere `idUsuario` o `correo` para crear la relación");
        }

        // crear entidad
        CalendarioCompartido cc = new CalendarioCompartido();
        CalendarioCompartidoId id = new CalendarioCompartidoId(usuarioDestino.getIdUsuario(), calendario.getIdCalendario());
        cc.setId(id);

        // set relaciones (usuario y calendario)
        cc.setUsuario(usuarioDestino);
        cc.setCalendario(calendario);

        // permiso (normalizar y mapear al enum Permiso)
        String permisoRecibido = dto.getPermiso();
        if (permisoRecibido == null || permisoRecibido.isBlank()) {
            permisoRecibido = "no_compartido";
        }
        Permiso permisoEnum = parsePermiso(permisoRecibido);
        cc.setPermiso(permisoEnum);

        return repository.save(cc);
    }

    public List<CalendarioCompartido> obtenerCalendariosPorUsuario(Integer idUsuario) {
        return repository.findByIdIdUsuario(idUsuario);
    }

    public void eliminarCompartido(Integer idUsuario, Integer idCalendario) {
        CalendarioCompartidoId id = new CalendarioCompartidoId(idUsuario, idCalendario);
        repository.deleteById(id);
    }

    /**
     * Método robusto para mapear una cadena a un Permiso:
     * - Intenta coincidencia por nombre ignorando mayúsculas/guiones/guiones bajos.
     * - Si no encuentra, devuelve Permiso.no_compartido si existe, o la primera constante disponible.
     */
    private Permiso parsePermiso(String raw) {
        if (raw == null) raw = "";
        String clave = raw.trim().replace("-", "_").replace(" ", "_");

        // Primer intento: coincidencia exacta ignorando mayúsculas
        for (Permiso p : Permiso.values()) {
            if (p.name().equalsIgnoreCase(clave)) return p;
        }

        // Segundo intento: buscar por contiene (más flexible)
        String normalized = clave.toLowerCase();
        for (Permiso p : Permiso.values()) {
            if (p.name().toLowerCase().contains(normalized) || normalized.contains(p.name().toLowerCase())) {
                return p;
            }
        }

        // Fallback: si existe no_compartido
        try {
            return Permiso.valueOf("no_compartido");
        } catch (Exception ex) {
            // si no existe esa constante, devolver la primera
            return Permiso.values().length > 0 ? Permiso.values()[0] : null;
        }
    }
}
