package de.busybeever.dsa.config.jackson;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import de.busybeever.dsa.data.entities.TalentCategoryEntity;

public class TalentSerializer extends JsonSerializer<TalentCategoryEntity>{

	@Override
	public void serialize(TalentCategoryEntity entity, JsonGenerator generator, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		generator.writeString(entity.getName());
	}
	
}
