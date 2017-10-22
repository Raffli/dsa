package de.busybeever.dsa.service;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadInfo {

	private String uploader;
	private String uploadMessage;
	private Date uploadedAt;
	private String downloadLink;
}
