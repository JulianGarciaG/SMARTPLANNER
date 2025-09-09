package com.co.smartplanner_backend.dto;

public class LoginDto {
    private String correoElectronico;
    private String contrasena;

    // Getters y Setters
    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}
