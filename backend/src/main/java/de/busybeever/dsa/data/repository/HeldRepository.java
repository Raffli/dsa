package de.busybeever.dsa.data.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.HeldEntity;

public interface HeldRepository extends CrudRepository<HeldEntity, Long>{

	@Query("select p.name from HeldEntity p")
	String[] getAllNames();
	
	HeldEntity findByName(String name);
}
