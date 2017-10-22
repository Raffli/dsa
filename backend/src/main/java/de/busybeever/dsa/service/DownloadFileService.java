package de.busybeever.dsa.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;

import javax.persistence.EntityNotFoundException;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.busybeever.dsa.data.entities.HeldEntity;
import de.busybeever.dsa.data.repository.HeldRepository;
import de.busybeever.dsa.data.repository.HeldenGruppeRepository;
import de.busybeever.dsa.exceptions.CorruptLinkException;
import de.busybeever.dsa.exceptions.KeyExpiredException;
import de.busybeever.dsa.service.FileInfoWrapper.FileInfo;


@Service
public class DownloadFileService {

	private static final String grpId = "790217747757546";
	private static HttpClient client = HttpClients.createDefault();
	private static final String BASE_URL = "https://graph.facebook.com/v2.10/";
	private static String KEY = "EAACEdEose0cBABIhxUvXDKeT3eOkh4eqRRkxTZAGQBoo5I6NG6OhqubVFu92SuH1ZAztrKy7s17PrqMINg51dhougGNHh84Fm1YPSf3L8A8yps2ir5MPlUzpDoXZAhjsqZA1vJsSuYwbWqV43lSVIkpZA6OGZCwdcAQVh5jxo1FOhZCrzvO7qtbGfixIX3ej4oJ3Y7GZCZAiC7gZDZD";
	
	@Autowired
	private HeldRepository heldRepository;
	
	@Autowired
	private ObjectMapper mapper;

	public HeldEntity downloadHeld(String name, String downloadLink) {
		HeldEntity held = this.heldRepository.findByName(name);
		if(held == null) {
			throw new EntityNotFoundException("Der Held, welcher geupdated werden sollte ist nicht in der Datenbank hinterlegt");
		}
		
//		if(!held.getGruppe().getName().equals("Der Runde Tisch")) {
//			//Error in prod
//		}
		try {
			File file = new File("temp");
			org.apache.commons.io.FileUtils.copyURLToFile(new URL(HtmlUtils.htmlEscape(downloadLink)), file);
			String xml = org.apache.commons.io.FileUtils.readFileToString(file);
			held.setXml(xml);
			this.heldRepository.save(held);
			return held;
		} catch (IOException e) {
			e.printStackTrace();
		}
		throw new CorruptLinkException("Datei konnte nicht runtergeladen werden");
		
	}

	public UploadInfo[] getMessages() {

		String[] fields = {"download_link", "updated_time", "message", "from"};
		String url = getRequestUrl(fields, KEY, "168385963741762/files");
		HttpGet get = new HttpGet(url);
		HttpResponse res;
		try {
			res = client.execute(get);
			
			String response = EntityUtils.toString(res.getEntity());
			if(response.contains("Error validating access token")) {
				throw new KeyExpiredException("Kein gültiger Zugriffs-Schlüssel vorhanden");
			}
			FileInfoWrapper info = mapper.readValue(response, FileInfoWrapper.class);
			UploadInfo[] infos = new UploadInfo[info.data.length];
			for (int i=0; i<info.data.length; i++) {
				String userName = info.data[i].getFrom().getName();
				String message = info.data[i].getMessage();
				Date uploadedAt = info.data[i].getUpdated_time();
				String downloadLink = info.data[i].getDownload_link();
				infos[i] = new UploadInfo(userName, message, uploadedAt, downloadLink);
			}
			return infos;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	

	private static String getRequestUrl(String[] fields, String token, String endpoint) {
		String url = getUrl(endpoint) + "?access_token=" + token + "&fields=";
		for (int i = 0; i < fields.length; i++) {
			url += fields[i];
			if (i != fields.length - 1) {
				url += "%2C";
			}
		}
		return url;
	}

	private static String getUrl(String call) {
		return BASE_URL + call;
	}

	public void uploadAccessKey(String key) {
		DownloadFileService.KEY = key;
		
	}
}
