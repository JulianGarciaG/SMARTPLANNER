DROP DATABASE if exists smartplanner;
CREATE database smartplanner;
USE smartplanner;
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(30) NOT NULL,
    foto VARCHAR(255)
);

CREATE TABLE Notificacion (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    mensaje TEXT,
    fecha_creacion DATETIME,
    tipo_notificacion ENUM('recortdatorio','alerta','alerta_critica'),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);



-- Tabla para las transacciones
CREATE TABLE Transaccion (
    id_gasto INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(12, 2) NOT NULL,
    descripcion TEXT,
    fecha DATE,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla para los planes de ahorro
CREATE TABLE Plan_ahorro (
    id_plan_ahorro INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(80) NOT NULL,
    monto_actual DECIMAL(12, 2) NOT NULL,
    monto_meta DECIMAL(12, 2) NOT NULL,
    fecha_fin DATE,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla para el detalle de planes de ahorro
CREATE TABLE Detalle_plan_ahorro (
    id_detalle_plan_ahorro INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(255),
    monto_aporte DECIMAL(12, 2) NOT NULL,
    fecha_aporte DATE,
    cumplido BOOLEAN DEFAULT FALSE,
    id_plan_ahorro INT,
    FOREIGN KEY (id_plan_ahorro) REFERENCES Plan_ahorro(id_plan_ahorro)
);

-- Tabla para los calendarios
CREATE TABLE Calendario (
    id_calendario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    tipo_de_calendario ENUM('personal', 'trabajo','otro')
);

CREATE TABLE Calendario_Compartido (
    id_usuario INT,
    id_calendario INT,
    permiso ENUM('ver', 'editar', 'eliminar'),
    PRIMARY KEY (id_usuario, id_calendario),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_calendario) REFERENCES Calendario(id_calendario)
);

-- Tabla para las tareas
CREATE TABLE Tarea (
    id_tarea INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    fecha_limite DATETIME,
    descripcion VARCHAR(255),
    estado_de_tarea BOOLEAN DEFAULT FALSE,
    prioridad ENUM('baja','media','alta'),
    categoria ENUM('asociada','sin_asociar'),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla para los eventos
CREATE TABLE Evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    descripcion VARCHAR(255),
    lugar VARCHAR(255),
    id_calendario INT,
    FOREIGN KEY (id_calendario) REFERENCES Calendario(id_calendario)
);