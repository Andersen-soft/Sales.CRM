package com.andersenlab.crm.repositories;

import com.andersenlab.crm.configuration.DataBaseConfig;
import com.andersenlab.crm.model.entities.Country;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@DataJpaTest
@Import(DataBaseConfig.class)
public class CountryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CountryRepository countryRepository;

    private final Long id;
    private final String name;
    private final String alpha2;
    private final String alpha3;

    public CountryRepositoryTest() {
        id = 1000L;
        name = "Test Country";
        alpha2 = "A2";
        alpha3 = "AL3";
    }

    @Before
    public void setUp() {
        Country country = new Country();
        country.setId(id);
        country.setNameRu(name);
        country.setAlpha2(alpha2);
        country.setAlpha3(alpha3);
        entityManager.persist(country);
        entityManager.flush();
        assertNotNull(country.getId());
    }

    @Test
    public void findOne() {
        Country found = countryRepository.findOne(id);
        assertEquals(found.getNameRu(), name);
        assertEquals(found.getAlpha2(), alpha2);
        assertEquals(found.getAlpha3(), alpha3);
    }
}