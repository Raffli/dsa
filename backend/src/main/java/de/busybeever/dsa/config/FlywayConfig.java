package de.busybeever.dsa.config;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

	@ConditionalOnProperty("flyway.cleanonstart")
	@Bean
	public Flyway flyway(DataSource datasource) {
		System.out.println("call");
		System.out.println("call");
		System.out.println("call");
		System.out.println("call");
		System.out.println("call");
		Flyway flyway = new Flyway();
	    flyway.setDataSource(datasource);
	   
	    flyway.clean();
	    flyway.setLocations("classpath:db/migration");
	    flyway.migrate();
	    
	    
	    return flyway;
	}
}