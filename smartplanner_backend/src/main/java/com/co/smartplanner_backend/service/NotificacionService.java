package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.NotificacionDto;
import com.co.smartplanner_backend.model.Notificacion;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.repository.NotificacionRepository;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<NotificacionDto> listarPorUsuario(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return notificacionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario)
                .stream()
                .map(n -> new NotificacionDto(
                        n.getIdNotificacion(),
                        n.getTitulo(),
                        n.getMensaje(),
                        n.getFechaCreacion(),
                        n.getTipoNotificacion().name(),
                        n.isLeida()
                ))
                .toList();
    }

    public Notificacion crear(Integer idUsuario, String titulo, String mensaje, String tipo) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Notificacion n = new Notificacion();
        n.setTitulo(titulo);
        n.setMensaje(mensaje);
        n.setFechaCreacion(LocalDateTime.now());
        n.setTipoNotificacion(
            Enum.valueOf(com.co.smartplanner_backend.model.TipoNotificacion.class, tipo.toUpperCase())
        );
        n.setUsuario(usuario);
        return notificacionRepository.save(n);
    }

    // ✅ Nuevo: crear notificación usando correo destino
    public Notificacion crearPorCorreo(String correoDestino, String titulo, String mensaje, String tipo) {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(correoDestino)
                .orElseThrow(() -> new RuntimeException("No existe un usuario con ese correo: " + correoDestino));

        Notificacion n = new Notificacion();
        n.setTitulo(titulo);
        n.setMensaje(mensaje);
        n.setFechaCreacion(LocalDateTime.now());
        n.setTipoNotificacion(
            Enum.valueOf(com.co.smartplanner_backend.model.TipoNotificacion.class, tipo.toUpperCase())
        );
        n.setUsuario(usuario);
        return notificacionRepository.save(n);
    }

    public Notificacion marcarLeida(Integer idNotificacion) {
        Notificacion notif = notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notif.setLeida(true);
        return notificacionRepository.save(notif);
    }

    public void eliminar(Integer idNotificacion) {
        notificacionRepository.deleteById(idNotificacion);
    }
}
