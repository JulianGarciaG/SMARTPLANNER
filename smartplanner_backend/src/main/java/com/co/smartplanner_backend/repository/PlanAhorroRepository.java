package com.co.smartplanner_backend.repository;


import com.co.smartplanner_backend.model.PlanAhorro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanAhorroRepository extends JpaRepository<PlanAhorro, Integer> {
}

