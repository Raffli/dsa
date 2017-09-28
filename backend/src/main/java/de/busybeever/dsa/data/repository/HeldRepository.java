package de.busybeever.dsa.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.HeldEntity;
import de.busybeever.dsa.rest.helden.NameGroupPair;

public interface HeldRepository extends CrudRepository<HeldEntity, Long>{

	@Query("select new de.busybeever.dsa.rest.helden.NameGroupPair(p.name, p.gruppe.name) from HeldEntity p where p.id != -1")
	List<NameGroupPair> getAllNames();
	
	HeldEntity findByName(String name);
}
