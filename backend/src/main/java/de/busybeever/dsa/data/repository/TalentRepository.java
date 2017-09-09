package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.talente.TalentEntity;

public interface TalentRepository extends CrudRepository<TalentEntity, Long>{

	TalentEntity findByName(String name);
}
