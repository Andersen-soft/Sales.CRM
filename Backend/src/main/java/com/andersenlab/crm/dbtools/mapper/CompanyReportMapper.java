package com.andersenlab.crm.dbtools.mapper;

import com.andersenlab.crm.dbtools.dto.CompanyReport;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class CompanyReportMapper implements RowMapper<CompanyReport> {
    @Override
    public CompanyReport mapRow(ResultSet resultSet, int i) throws SQLException {
        CompanyReport target = new CompanyReport();

        target.setName(resultSet.getString("name"));
        target.setUrl(resultSet.getString("url"));
        target.setPhone(resultSet.getString("phone"));
        target.setDescription(resultSet.getString("description"));
        target.setSales(resultSet.getString("sales"));

        return target;
    }
}
