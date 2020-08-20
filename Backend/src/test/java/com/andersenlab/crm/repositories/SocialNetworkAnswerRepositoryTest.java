package com.andersenlab.crm.repositories;

import com.andersenlab.crm.configuration.DataBaseConfig;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.PersistenceException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@Slf4j
@RunWith(SpringRunner.class)
@DataJpaTest
@Import(DataBaseConfig.class)
public class SocialNetworkAnswerRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SocialNetworkAnswerRepository answerRepository;

    private final String message;
    private final String linkLead;
    private final String firstName;
    private final String lastName;
    private final Sex sex;
    private Long id;
    private SocialNetworkAnswer networkAnswerForTest;

    public SocialNetworkAnswerRepositoryTest() {
        message = "my interesting message !@#$%^&*()_+";
        linkLead = "https://crm-dev.andersenlab.com:8090/swagger-ui.html#/country-controller";
        firstName = "Test First name";
        lastName = "Test Last name";
        sex = Sex.MALE;
    }

    @Before
    public void setUp() {
        SocialNetworkContact contact = new SocialNetworkContact();
        entityManager.persist(contact);
        entityManager.flush();
        assertNotNull(contact.getId());

        Country country = new Country();
        Long countryId = 9999L;
        country.setId(countryId);
        String countryName = "Test country";
        country.setNameRu(countryName);
        String countryAlpha2 = "A2";
        country.setAlpha2(countryAlpha2);
        String countryAlpha3 = "AL3";
        country.setAlpha3(countryAlpha3);
        entityManager.persist(country);
        entityManager.flush();
        assertEquals(countryId, country.getId());

        Company company = new Company();
        String companyName = "Test country";
        company.setName(companyName);
        company.setIsActive(true);
        entityManager.persist(company);
        entityManager.flush();
        assertNotNull(company.getId());

        SocialNetworkAnswer networkAnswer = new SocialNetworkAnswer();
        networkAnswer.setSocialNetworkContact(contact);
        networkAnswer.setMessage(message);
        networkAnswer.setLinkLead(linkLead);
        networkAnswer.setFirstName(firstName);
        networkAnswer.setLastName(lastName);
        networkAnswer.setSex(sex);
        networkAnswer.setCountry(country);
        networkAnswer.setCompanyName(companyName);
        entityManager.persist(networkAnswer);
        entityManager.flush();
        assertNotNull(networkAnswer.getId());
        assertNotNull(networkAnswer.getCreateDate());
        id = networkAnswer.getId();

        networkAnswerForTest = new SocialNetworkAnswer();
        networkAnswer.setSocialNetworkContact(contact);
        networkAnswer.setMessage(message);
        networkAnswer.setLinkLead(linkLead);
        networkAnswer.setFirstName(firstName);
        networkAnswer.setLastName(lastName);
        networkAnswer.setSex(sex);
        networkAnswer.setCountry(country);
        networkAnswer.setCompanyName(companyName);
    }

    @Test
    public void findOne() {
        SocialNetworkAnswer networkAnswer = answerRepository.findOne(id);
        assertNotNull(networkAnswer);
        assertEquals(id, networkAnswer.getId());
        assertEquals(message, networkAnswer.getMessage());
        assertEquals(linkLead, networkAnswer.getLinkLead());
        assertEquals(firstName, networkAnswer.getFirstName());
        assertEquals(lastName, networkAnswer.getLastName());
        assertEquals(sex, networkAnswer.getSex());
        assertNotNull(networkAnswer.getCreateDate());

        assertNotNull(networkAnswer.getSocialNetworkContact());
        assertNotNull(networkAnswer.getCountry());
        assertNotNull(networkAnswer.getCompanyName());
    }

    @Test(expected = PersistenceException.class)
    public void saveWithoutMessage() {
        networkAnswerForTest.setMessage(null);
        entityManager.persist(networkAnswerForTest);
        entityManager.flush();
    }

    @Test(expected = PersistenceException.class)
    public void saveWithoutLinkLead() {
        networkAnswerForTest.setLinkLead(null);
        entityManager.persist(networkAnswerForTest);
        entityManager.flush();
    }

    @Test(expected = PersistenceException.class)
    public void saveWithoutFirstName() {
        networkAnswerForTest.setFirstName(null);
        entityManager.persist(networkAnswerForTest);
        entityManager.flush();
    }

    @Test(expected = PersistenceException.class)
    public void saveWithoutLastName() {
        networkAnswerForTest.setLastName(null);
        entityManager.persist(networkAnswerForTest);
        entityManager.flush();
    }

    @Test(expected = PersistenceException.class)
    public void saveWithoutSex() {
        networkAnswerForTest.setSex(null);
        entityManager.persist(networkAnswerForTest);
        entityManager.flush();
    }
}