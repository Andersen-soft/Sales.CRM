package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.LdapUser;
import com.unboundid.ldap.sdk.Attribute;
import com.unboundid.ldap.sdk.SearchResultEntry;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SearchResultEntryToLdapUserConverterTest {

    private SearchResultEntryToLdapUserConverter converter = new SearchResultEntryToLdapUserConverter();

    @Test
    public void testConvert() {
        Attribute[] attributes = new Attribute[]{new Attribute("SamAccountName", "testName"),
                new Attribute("cn", "testCn"),
                new Attribute("mail", "testprincipal"),
                new Attribute("whenCreate", "20120514045300.0Z")};

        SearchResultEntry source = new SearchResultEntry("dn", attributes);

        LdapUser result = converter.convert(source);

        assertEquals(attributes[0].getValue(), result.getLogin());
        assertEquals(attributes[1].getValue(), result.getName());
        assertEquals(attributes[2].getValue(), result.getEmail());
    }

    @Test
    public void testGetSource() {
        Class<SearchResultEntry> expectedResult = SearchResultEntry.class;

        Class<SearchResultEntry> result = converter.getSource();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetTarget() {
        Class<LdapUser> expectedResult = LdapUser.class;

        Class<LdapUser> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}