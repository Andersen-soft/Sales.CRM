package com.andersenlab.crm.configuration;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.LdapSearchException;
import com.andersenlab.crm.model.LdapUser;
import com.google.common.collect.ImmutableList;
import com.unboundid.asn1.ASN1OctetString;
import com.unboundid.ldap.sdk.Filter;
import com.unboundid.ldap.sdk.LDAPConnection;
import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.SearchRequest;
import com.unboundid.ldap.sdk.SearchResult;
import com.unboundid.ldap.sdk.SearchScope;
import com.unboundid.ldap.sdk.controls.SimplePagedResultsControl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
public class CrmLdapHelper {

    private final String filterString;
    private final String baseDN;
    private final List<CrmLdapConnectionRequest> connectionRequests;
    private final ConversionService conversionService;
    private final boolean isEnable;

    public CrmLdapHelper(CrmLdapConnectionRequest connectionRequest,
                         ConversionService conversionService,
                         String filterString,
                         String baseDN,
                         boolean isEnable) {
        this(Collections.singletonList(connectionRequest), conversionService, filterString,
                baseDN, isEnable);
    }

    public CrmLdapHelper(List<CrmLdapConnectionRequest> connectionRequests,
                         ConversionService conversionService,
                         String filterString,
                         String baseDN,
                         boolean isEnable) {
        this.connectionRequests = connectionRequests;
        this.conversionService = conversionService;
        this.filterString = filterString;
        this.baseDN = baseDN;
        this.isEnable = isEnable;
    }

    @Cacheable(value = "ldapUsers")
    public ImmutableList<LdapUser> getAllUsers() {
        if (!isEnable) {
            return ImmutableList.of();
        }
        try (LDAPConnection connection = getSuccessfulConnection()) {
            return ImmutableList.copyOf(findAllUsers(connection));
        } catch (LDAPException e) {
            log.error("Unable to connect to get users", e);
            throw new LdapSearchException("Unable to find users");
        }
    }

    public Boolean tryConnectWithCredentials(String login, String pass) {
        return isEnable && connectionRequests.stream()
                .anyMatch(connectionRequest -> tryConnect(connectionRequest, login, pass));
    }

    private List<LdapUser> findAllUsers(LDAPConnection connection) throws LDAPException {
        connection.reconnect();
        Filter filter = Filter.create(filterString);
        SearchRequest searchRequest = new SearchRequest(baseDN, SearchScope.SUB, filter);
        ASN1OctetString resume = null;
        List<LdapUser> users = new ArrayList<>();
        while (true) {
            searchRequest.setControls(new SimplePagedResultsControl(1000, resume));
            SearchResult searchResult = connection.search(searchRequest);
            users.addAll(conversionService.convertToList(searchResult.getSearchEntries(), LdapUser.class));
            SimplePagedResultsControl responseControl =
                    SimplePagedResultsControl.get(searchResult);
            if (responseControl != null && responseControl.moreResultsToReturn()) {
                resume = responseControl.getCookie();
            } else {
                break;
            }
        }
        return users;
    }

    private LDAPConnection getSuccessfulConnection() {
        for (CrmLdapConnectionRequest connectionRequest : connectionRequests) {
            LDAPConnection successfulConnection = getSuccessfulConnection(connectionRequest,
                    connectionRequest.getLogin(),
                    connectionRequest.getPass());
            if (successfulConnection != null) {
                return successfulConnection;
            }
        }

        throw new LdapSearchException("Unable to find users");
    }

    private LDAPConnection getSuccessfulConnection(CrmLdapConnectionRequest connectionRequest, String login, String pass) {
        if (!isEnable) {
            return null;
        }
        try (LDAPConnection connection = new LDAPConnection(connectionRequest.getUrl(), connectionRequest.getPort())) {
            connection.bind(login, pass);
            return connection;
        } catch (LDAPException e) {
            log.error("Unable to connect to {}:{}. Error {}", connectionRequest.getUrl(), connectionRequest.getPort(), e);
            return null;
        }
    }

    private Boolean tryConnect(CrmLdapConnectionRequest connectionRequest, String login, String pass) {
        return getSuccessfulConnection(connectionRequest, login, pass) != null;
    }
}
