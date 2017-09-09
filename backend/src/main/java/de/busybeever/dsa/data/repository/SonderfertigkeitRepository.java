package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.talente.SonderfertigkeitEntity;

public interface SonderfertigkeitRepository extends CrudRepository<SonderfertigkeitEntity, Long>{

	public SonderfertigkeitEntity findByName(String name);
}
