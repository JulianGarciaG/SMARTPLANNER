DROP DATABASE IF EXISTS smartplanner;
CREATE DATABASE smartplanner;
USE smartplanner;

-- ================================
-- TABLAS SIN LLAVES FORÁNEAS
-- ================================

-- TABLA USUARIO
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    foto MEDIUMBLOB
);

-- TABLA TIPO DE PLAN
CREATE TABLE Tipo_Plan (
    id_tipo_plan INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    periodo ENUM('mensual', 'anual') NOT NULL,
    max_calendarios INT DEFAULT NULL,
    max_eventos_mes INT DEFAULT NULL,
    max_usuarios_equipo INT DEFAULT NULL,
    soporte_prioritario BOOLEAN DEFAULT FALSE,
    backup_automatico BOOLEAN DEFAULT FALSE,
    integraciones_avanzadas BOOLEAN DEFAULT FALSE,
    dashboard_empresarial BOOLEAN DEFAULT FALSE,
    reportes_personalizados BOOLEAN DEFAULT FALSE,
    consultoria_personalizada BOOLEAN DEFAULT FALSE,
    api_personalizada BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA CALENDARIO
CREATE TABLE Calendario (
    id_calendario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#4285f4',
    tipo_de_calendario ENUM('personal', 'trabajo','otro')
);

-- ================================
-- TABLAS CON 1 LLAVE FORÁNEA
-- ================================

-- TABLA NOTIFICACION
CREATE TABLE Notificacion (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    mensaje TEXT,
    fecha_creacion DATETIME,
    tipo_notificacion ENUM('recordatorio','alerta','alerta_critica'),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- TABLA SUSCRIPCION
CREATE TABLE Suscripcion (
    id_suscripcion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_tipo_plan INT NOT NULL DEFAULT 1,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activa', 'cancelada', 'vencida', 'pendiente') DEFAULT 'pendiente',
    precio_pagado DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_plan) REFERENCES Tipo_Plan(id_tipo_plan)
);

-- TABLA CALENDARIO COMPARTIDO
CREATE TABLE Calendario_Compartido (
    id_usuario INT,
    id_calendario INT,
    permiso ENUM('no_compartido', 'ver', 'editar') NOT NULL,
    PRIMARY KEY (id_usuario, id_calendario),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_calendario) REFERENCES Calendario(id_calendario)
);

-- TABLA TAREA
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

-- TABLA EVENTO
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

-- TABLA PLAN DE AHORRO
CREATE TABLE Plan_ahorro (
    id_plan_ahorro INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(80) NOT NULL,
    monto_actual DECIMAL(12, 2) NOT NULL,
    monto_meta DECIMAL(12, 2) NOT NULL,
    fecha_fin DATE,
    id_usuario INT,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- TABLA PAGO
CREATE TABLE Pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_suscripcion INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    estado_pago ENUM('completado', 'pendiente', 'fallido', 'reembolsado') DEFAULT 'pendiente',
    referencia_pago VARCHAR(255),
    datos_pago JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_suscripcion) REFERENCES Suscripcion(id_suscripcion)
);

-- ================================
-- TABLAS CON MÚLTIPLES LLAVES FORÁNEAS
-- ================================

-- TABLA TRANSACCION
CREATE TABLE Transaccion (
    id_gasto INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL NOT NULL,
    descripcion TEXT,
    tipo ENUM('ingreso', 'egreso') NOT NULL,
    categoria VARCHAR(100),
    fecha DATE,
    id_tarea INT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_tarea) REFERENCES Tarea(id_tarea)
);

-- TABLA DETALLE PLAN DE AHORRO
CREATE TABLE Detalle_plan_ahorro (
    id_detalle_plan_ahorro INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(255),
    monto_aporte DECIMAL(12, 2) NOT NULL,
    fecha_aporte DATE,
    cumplido BOOLEAN DEFAULT FALSE,
    id_plan_ahorro INT,
    FOREIGN KEY (id_plan_ahorro) REFERENCES Plan_ahorro(id_plan_ahorro) ON DELETE CASCADE
);

-- ================================
-- INSERTAR PLANES PREDETERMINADOS
-- ================================
INSERT INTO Tipo_Plan (nombre, descripcion, precio, periodo, max_calendarios, max_eventos_mes, max_usuarios_equipo, 
                       soporte_prioritario, backup_automatico, integraciones_avanzadas, dashboard_empresarial, 
                       reportes_personalizados, consultoria_personalizada, api_personalizada) VALUES
('Gratuito', 'Perfecto para uso personal básico', 0.00, 'mensual', 1, 50, 1, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Personal', 'Ideal para profesionales independientes', 15000.00, 'mensual', NULL, NULL, 1, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE),
('Empresas Medianas', 'Para equipos medianos y empresas en crecimiento', 120000.00, 'mensual', NULL, NULL, 25, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE),
('Empresas Grandes', 'Para grandes empresas y uso corporativo', 500000.00, 'mensual', NULL, NULL, NULL, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);