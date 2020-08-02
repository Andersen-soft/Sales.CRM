package com.andersenlab.crm.dbtools.dto;

import lombok.Data;

@Data
public class ResumeProcessingReport {
	private Long id;
	private String requestName;
	private String companyName;
	private String responsibleName;
	private String responsibleRmName;
	private String responsibleHrName;
	private String fio;
	private Long durationInMinutes;
	private Long resumeId;

}
