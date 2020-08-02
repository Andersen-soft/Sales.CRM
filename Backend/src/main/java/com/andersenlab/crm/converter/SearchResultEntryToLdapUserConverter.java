package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.LdapUser;
import com.unboundid.ldap.sdk.SearchResultEntry;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Component
public class SearchResultEntryToLdapUserConverter implements Converter<SearchResultEntry, LdapUser> {
    @Override
    public LdapUser convert(SearchResultEntry source) {
        LdapUser ldapUser = new LdapUser();
        ldapUser.setLogin(source.getAttributeValue("SamAccountName"));
        ldapUser.setName(source.getAttributeValue("cn"));
        ldapUser.setEmail(source.getAttributeValue("mail"));
        Optional.ofNullable(source.getAttributeValue("whenCreated"))
                .ifPresent(createDate -> ldapUser.setCreateDate(convertedDate(createDate)));
        return ldapUser;
    }

    private LocalDateTime convertedDate(String createDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss'.0Z'");
        return LocalDateTime.parse(createDate, formatter);
    }

    @Override
    public Class<SearchResultEntry> getSource() {
        return SearchResultEntry.class;
    }

    @Override
    public Class<LdapUser> getTarget() {
        return LdapUser.class;
    }
}
