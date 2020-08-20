package com.andersenlab.crm.rest.request;

import lombok.Data;

@Data
public class ReportRequestFilter {
    private boolean createDate;
    private boolean sourceName;
    private boolean companyRecommendationName;
    private boolean id;
    private boolean status;
    private boolean category;
    private boolean statusChangedDate;
    private boolean lastActivityDate;
    private boolean responsibleId;
    private boolean responsibleName;
    private boolean weight;
    private boolean requestType;
    private boolean requestNames;
    private boolean companyName;
    private boolean responsibleRmName;
    private boolean companyUrl;
    private boolean mainContact;
    private boolean contactPosition;
    private boolean email;
    private boolean skype;
    private boolean socialNetwork;
    private boolean socialContact;
    private boolean phone;
    private boolean personalEmail;
    private boolean country;
    private boolean industry;
}
