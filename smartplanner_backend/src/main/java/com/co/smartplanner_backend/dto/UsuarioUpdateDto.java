package com.co.smartplanner_backend.dto;


public class UsuarioUpdateDto {
    private String nombre;
    private String contrasena;
    private String foto;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}
