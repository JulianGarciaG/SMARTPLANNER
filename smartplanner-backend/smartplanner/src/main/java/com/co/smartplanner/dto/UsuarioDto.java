package com.co.smartplanner.dto;

public class UsuarioDto {
    private String nombre;
    private String correoElectronico;
    private String contrasena;
    private String foto;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}
