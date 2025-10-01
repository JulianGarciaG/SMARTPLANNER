package com.co.smartplanner_backend.repository;



import com.co.smartplanner_backend.model.Suscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Integer> {
    List<Suscripcion> findByIdUsuario(Integer idUsuario);
}

