package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.TIpoPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoPlanRepository extends JpaRepository<TIpoPlan, Integer> {
}
