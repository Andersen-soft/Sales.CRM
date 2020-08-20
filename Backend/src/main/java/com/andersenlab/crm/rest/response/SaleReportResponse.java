package com.andersenlab.crm.rest.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleReportResponse {
    private LocalDateTime createDate;
    private Long sourceId;
    private String sourceName;
    private Long id;
    private String status;
    private LocalDateTime statusChangedDate;
    private LocalDate statusDate;
    private String category;
    private Long responsibleId;
    private LocalDateTime lastActivityDate;
    private String responsibleName;
    private Long weight;
    private String requestType;
    private List<SaleRequestDto> requestNames;
    private String companyName;
    private String companyUrl;
    private Long companyResponsibleRmId;
    private String companyResponsibleRmName;
    private Long companyRecommendationId;
    private String companyRecommendationName;
    private String mainContact;
    private String contactPosition;
    private String email;
    private String skype;
    private String socialNetwork;
    private String socialContact;
    private String phone;
    private String personalEmail;
    private Long countryId;
    private String country;
    private List<IndustryDto> industries;
}
