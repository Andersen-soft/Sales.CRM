package com.andersenlab.crm.rest.response;

import lombok.Data;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.List;
import java.util.Set;

@Data
public class CompanyResponseSimple extends CompanyResponseBase {

    private String url;
    private String description;
    private Set<Long> linkedSales;
    private List<IndustryDto> industryDtos;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CompanyResponseSimple that = (CompanyResponseSimple) o;

        return new EqualsBuilder()
                .appendSuper(super.equals(o))
                .append(url, that.url)
                .append(linkedSales, that.linkedSales)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .appendSuper(super.hashCode())
                .append(url)
                .append(linkedSales)
                .toHashCode();
    }
}
