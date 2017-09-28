package de.busybeever.dsa.config.jackson;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import de.busybeever.dsa.data.entities.HeldenGruppeEntity;
import de.busybeever.dsa.data.repository.HeldenGruppeRepository;

public class GruppeDeserializer extends JsonDeserializer<HeldenGruppeEntity> {
	
	@Autowired
	private HeldenGruppeRepository heldenGruppeRepository;
	
	{
		//TODO autowire repo
	}
	
	@Override
	public HeldenGruppeEntity deserialize(JsonParser parser, DeserializationContext ctx)
			throws IOException, JsonProcessingException {
		String name = parser.getValueAsString();
		return this.heldenGruppeRepository.findByName(name);
	}

}
