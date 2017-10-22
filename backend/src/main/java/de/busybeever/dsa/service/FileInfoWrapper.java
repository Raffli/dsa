package de.busybeever.dsa.service;

import java.util.Date;

import lombok.Data;

@Data
public class FileInfoWrapper {

	public FileInfo[] data;
	
	@Data
	public static class FileInfo {
		private String download_link;
		private Date updated_time;
		private String message;
		private FacebookUser from;
	}
	
	@Data
	public static class FacebookUser {
		private String name;
		private String id;
	}
	
	
}


