package de.busybeever.dsa.data.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.HeldenGruppeEntity;

public interface HeldenGruppeRepository extends CrudRepository<HeldenGruppeEntity, Long>{
	
	public HeldenGruppeEntity findByName(String name);
	
	@Query("select p.name from HeldenGruppeEntity p")
	public String[] getAllNames();

}
