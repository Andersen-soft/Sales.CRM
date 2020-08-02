package com.andersenlab.crm.dbtools.mapper;

import com.andersenlab.crm.dbtools.dto.ContactReport;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

@Component
public class ContactReportMapper implements RowMapper<ContactReport> {
    @Override
    public ContactReport mapRow(ResultSet resultSet, int i) throws SQLException {
        ContactReport target = new ContactReport();

        target.setFirstName(resultSet.getString("first_name"));
        target.setLastName(resultSet.getString("last_name"));
        target.setCompany(resultSet.getString("company_name"));
        target.setPosition(resultSet.getString("position"));
        target.setEmail(resultSet.getString("email"));
        target.setSkype(resultSet.getString("skype"));
        target.setSocialNetwork(resultSet.getString("social_network"));
        target.setSocialNetworkUser(resultSet.getString("social_network_user"));
        target.setPhone(resultSet.getString("phone"));
        target.setPersonalEmail(resultSet.getString("personal_email"));
        target.setCountry(resultSet.getString("country_name"));
        target.setSex(resultSet.getString("sex"));
        target.setMainContact(resultSet.getString("sales"));
        target.setSales(resultSet.getString("sales"));
        target.setSources(resultSet.getString("sources"));
        target.setDateOfBirth(timestampToString(resultSet.getTimestamp("date_of_birth")));
        return target;
    }

    private String timestampToString(Timestamp timestamp) {
        return timestamp == null ? "" : timestamp.toLocalDateTime().toLocalDate()
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    }
}
