package com.co.smartplanner_backend.dto;


public class UsuarioLoginDto {
    private Integer id_usuario;
    private String nombre;
    private String correoElectronico;

    public UsuarioLoginDto() {}

    public UsuarioLoginDto(Integer id_usuario, String nombre, String correoElectronico) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correoElectronico = correoElectronico;
    }

    public Integer getId_usuario() { return id_usuario; }
    public void setId_usuario(Integer id_usuario) { this.id_usuario = id_usuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }

 
    
}
