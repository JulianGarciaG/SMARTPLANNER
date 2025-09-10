package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.LoginDto;
import com.co.smartplanner_backend.dto.UsuarioDto;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.dto.UsuarioUpdateDto;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;


import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registro
    public Usuario registrarUsuario(UsuarioDto dto) {
        if (usuarioRepository.existsByCorreoElectronico(dto.getCorreoElectronico())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena())); // Encriptar
        usuario.setFoto(dto.getFoto());

        return usuarioRepository.save(usuario);
    }

    // Login básico (sin JWT)
    public Usuario login(LoginDto loginDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoElectronico(loginDTO.getCorreoElectronico());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (passwordEncoder.matches(loginDTO.getContrasena(), usuario.getContrasena())) {
                return usuario;
            } else {
                throw new RuntimeException("Contraseña incorrecta");
            }
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }
    // Listar todos
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Buscar por id
    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario actualizarUsuario(Integer idUsuario, UsuarioUpdateDto updateDTO) throws Exception {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(idUsuario);
        if (optionalUsuario.isEmpty()) {
            throw new Exception("Usuario no encontrado");
        }

        Usuario usuario = optionalUsuario.get();
        if (updateDTO.getNombre() != null && !updateDTO.getNombre().isEmpty()) {
            usuario.setNombre(updateDTO.getNombre());
        }
        if (updateDTO.getContrasena() != null && !updateDTO.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(updateDTO.getContrasena()));
        }
        if (updateDTO.getFoto() != null && !updateDTO.getFoto().isEmpty()) {
            usuario.setFoto(updateDTO.getFoto());
        }

        return usuarioRepository.save(usuario);
    }

}
