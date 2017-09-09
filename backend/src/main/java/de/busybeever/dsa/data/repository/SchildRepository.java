package de.busybeever.dsa.data.repository;

import org.springframework.data.repository.CrudRepository;

import de.busybeever.dsa.data.entities.ausruestung.SchildEntity;

public interface SchildRepository extends CrudRepository<SchildEntity, Long>{

	public SchildEntity findByName(String name);
}
