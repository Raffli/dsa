package de.busybeever.dsa.config.jackson;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import de.busybeever.dsa.data.entities.HeldenGruppeEntity;

public class PasswordSerializer  extends JsonSerializer<String>{

	@Override
	public void serialize(String password, JsonGenerator generator, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		generator.writeBoolean(password != null);
	}
}
