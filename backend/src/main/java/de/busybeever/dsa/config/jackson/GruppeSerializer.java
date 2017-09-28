package de.busybeever.dsa.config.jackson;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import de.busybeever.dsa.data.entities.HeldenGruppeEntity;
import de.busybeever.dsa.data.entities.talente.TalentCategoryEntity;

public class GruppeSerializer extends JsonSerializer<HeldenGruppeEntity>{

	@Override
	public void serialize(HeldenGruppeEntity entity, JsonGenerator generator, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		generator.writeString(entity.getName());
		
	}
	
}


