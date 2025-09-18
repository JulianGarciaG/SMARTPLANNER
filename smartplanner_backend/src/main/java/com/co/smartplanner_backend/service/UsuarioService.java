package com.co.smartplanner_backend.service;

import com.co.smartplanner_backend.dto.LoginDto;
import com.co.smartplanner_backend.dto.UsuarioDto;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;



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
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
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

    public Usuario actualizarUsuario(Integer id, String nombre, String contrasena, MultipartFile foto) throws Exception {
        Usuario usuario = obtenerPorId(id);

        if (nombre != null && !nombre.isBlank()) usuario.setNombre(nombre);
        if (contrasena != null && !contrasena.isBlank()) {
        usuario.setContrasena(passwordEncoder.encode(contrasena));}
        
        if (foto != null && !foto.isEmpty()) {
            // Guardar en carpeta local (ej: uploads/)
            String carpeta = "uploads/";
            Path ruta = Paths.get(carpeta);
            if (!Files.exists(ruta)) {
                Files.createDirectories(ruta);
            }

            String base64 = Base64.getEncoder().encodeToString(foto.getBytes());
            usuario.setFoto("data:" + foto.getContentType() + ";base64," + base64);

        }

        return usuarioRepository.save(usuario);
    }
}


