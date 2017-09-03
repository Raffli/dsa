package de.busybeever.dsa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import de.busybeever.dsa.data.entities.HeldEntity;
import de.busybeever.dsa.data.repository.HeldRepository;

@Configuration
public class InitDataService {

	@Autowired
	private HeldRepository heldRepository;
	
	@EventListener
	public void initData(ContextRefreshedEvent e) {
		//TODO
	}
	
	
}
