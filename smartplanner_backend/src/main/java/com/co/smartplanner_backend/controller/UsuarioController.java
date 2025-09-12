package com.co.smartplanner_backend.controller;

import com.co.smartplanner_backend.dto.LoginDto;
import com.co.smartplanner_backend.dto.UsuarioDto;
import com.co.smartplanner_backend.dto.UsuarioLoginDto;
import com.co.smartplanner_backend.dto.UsuarioUpdateDto;
import com.co.smartplanner_backend.model.Usuario;
import com.co.smartplanner_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Registro
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody UsuarioDto dto) {
        try {
            Usuario usuario = usuarioService.registrarUsuario(dto);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login
 @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDTO) {
        try {
            Usuario usuario = usuarioService.login(loginDTO);

            // Crear DTO de respuesta (sin devolver la contraseña)
            UsuarioLoginDto resp = new UsuarioLoginDto(
                usuario.getIdUsuario(),   
                usuario.getNombre(),
                usuario.getCorreoElectronico()
            );

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Listar todos
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    // Buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.obtenerPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(
        @PathVariable Integer id,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String contrasena,
        @RequestParam(required = false) MultipartFile foto) {
            try {
                Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, nombre, contrasena, foto);
                return ResponseEntity.ok(usuarioActualizado);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
}
