package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ContactResponse {

    private Long id;
    private Boolean isActive;
    private String firstName;
    private String lastName;
    private String position;
    private String email;
    private String skype;
    private String socialNetwork;
    private SocialNetworkUserDto socialNetworkUser;
    private String phone;
    private String personalEmail;
    private CountryDto country;
    private Sex sex;
    private LocalDate dateOfBirth;
    private List<Long> companyRelatedSales;
    private CompanyDto company;
    private List<Long> contactRelatedSales;
}
