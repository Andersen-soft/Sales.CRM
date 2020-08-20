package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.SaleRequestService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.REGIONAL;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

public class CompanySaleRegionalDistributionTest {
    private SaleRequestService saleRequestService = mock(SaleRequestService.class);
    private EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private ApplicationProperties applicationProperties = mock(ApplicationProperties.class);

    private CompanySaleRegionalDistributionService regionalDistributionService =
            new CompanySaleRegionalDistributionService(
                    saleRequestService,
                    employeeRepository,
                    eventPublisher,
                    applicationProperties
            );

    private Employee firstParticipant;
    private Employee secondParticipant;
    private Employee nonParticipant;

    private Country regionalCountry;
    private Country nonRegionalCountry;

    private CompanySale inDayDistribution;
    private CompanySale fromDistribution;

    @Before
    public void setUpEntities() {
        Role mockedRole = new Role();
        mockedRole.setName(RoleEnum.ROLE_SALES);

        doReturn("GMT+3").when(applicationProperties).getTimezone();

        regionalCountry = new Country();
        regionalCountry.setId(1L);
        regionalCountry.setNameRu("regional");

        nonRegionalCountry = new Country();
        nonRegionalCountry.setId(2L);
        nonRegionalCountry.setNameRu("not regional");

        String forFirst = "first";
        firstParticipant = new Employee();
        firstParticipant.setId(1L);
        firstParticipant.setLogin(forFirst);
        firstParticipant.setEmail(forFirst);
        firstParticipant.setRegionalDistributionDate(null);
        firstParticipant.setRegionalDistributionParticipant(true);
        firstParticipant.setCountries(Collections.singleton(regionalCountry));
        firstParticipant.setRoles(Collections.singleton(mockedRole));

        String forSecond = "second";
        secondParticipant = new Employee();
        secondParticipant.setId(2L);
        secondParticipant.setLogin(forSecond);
        secondParticipant.setEmail(forSecond);
        secondParticipant.setRegionalDistributionDate(null);
        secondParticipant.setRegionalDistributionParticipant(true);
        secondParticipant.setCountries(Collections.singleton(regionalCountry));
        secondParticipant.setRoles(Collections.singleton(mockedRole));

        String forNonParticipant = "non-participant";
        nonParticipant = new Employee();
        nonParticipant.setId(3L);
        nonParticipant.setLogin(forNonParticipant);
        nonParticipant.setEmail(forNonParticipant);
        nonParticipant.setRegionalDistributionDate(null);
        nonParticipant.setRegionalDistributionParticipant(false);
        nonParticipant.setCountries(Collections.emptySet());
        nonParticipant.setRoles(Collections.singleton(mockedRole));

        List<Employee> participants = Arrays.asList(firstParticipant, secondParticipant);
        doReturn(participants)
                .when(employeeRepository).findByCountriesAndIsActiveTrue(Collections.singletonList(regionalCountry));

        Company mockedCompany = new Company();
        mockedCompany.setId(1L);
        mockedCompany.setName("my life for the horde");

        Contact regionalContact = new Contact();
        regionalContact.setId(1L);
        regionalContact.setCountry(regionalCountry);
        regionalContact.setCompany(mockedCompany);

        Contact nonRegionalContact = new Contact();
        nonRegionalContact.setId(2L);
        nonRegionalContact.setCountry(nonRegionalCountry);
        nonRegionalContact.setCompany(mockedCompany);

        mockedCompany.setContacts(Arrays.asList(regionalContact, nonRegionalContact));

        inDayDistribution = new CompanySale();
        inDayDistribution.setId(1L);
        inDayDistribution.setCompany(mockedCompany);
        inDayDistribution.setMainContact(regionalContact);

        CompanySale notInDistribution = new CompanySale();
        notInDistribution.setId(2L);
        notInDistribution.setCompany(mockedCompany);
        notInDistribution.setMainContact(nonRegionalContact);

        fromDistribution = new CompanySale();
        fromDistribution.setId(3L);
        fromDistribution.setTimeStatus(REGIONAL);
        fromDistribution.setCompany(mockedCompany);
        fromDistribution.setMainContact(regionalContact);
    }

    @Test
    public void whenFindNextRegionalEmployeeByCountryThenReturnWithMinTime() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        Employee actual = regionalDistributionService.findNextRegionalEmployeeByCountry(regionalCountry);
        Assert.assertEquals(secondParticipant, actual);
    }

    @Test
    public void whenFindNextRegionalEmployeeByCountryThenReturnWithNullDate() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        firstParticipant.setRegionalDistributionDate(forFirstParticipant);

        Employee actual = regionalDistributionService.findNextRegionalEmployeeByCountry(regionalCountry);
        Assert.assertEquals(secondParticipant, actual);
    }

    @Test
    public void whenFindNextRegionalEmployeeByCountryThenReturnWithLowerId() {
        Employee actual = regionalDistributionService.findNextRegionalEmployeeByCountry(regionalCountry);
        Assert.assertEquals(firstParticipant, actual);
    }

    @Test
    public void whenFindNextRegionalEmployeeByCountryThenReturnNoEmployee() {
        Employee actual = regionalDistributionService.findNextRegionalEmployeeByCountry(nonRegionalCountry);
        Assert.assertNull(actual);
    }

    @Test
    public void whenCheckEmployeeByNullCountryThenReturnNoEmployee() {
        Employee actual = regionalDistributionService.findNextRegionalEmployeeByCountry(null);
        Assert.assertNull(actual);
    }

    @Test
    public void whenAssignResponsibleEmployeeThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(1);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);
        regionalDistributionService.setResponsibleRegionalEmployeeAndMailNotify(inDayDistribution, firstParticipant);

        Assert.assertEquals(firstParticipant, inDayDistribution.getResponsible());
        Assert.assertEquals(REGIONAL, inDayDistribution.getTimeStatus());
        Assert.assertNotNull(firstParticipant.getRegionalDistributionDate());
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isAfter(
                secondParticipant.getRegionalDistributionDate()));
        Mockito.verify(saleRequestService, times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateQueueOnManualResponsibleChangeForOldSaleThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(4));

        regionalDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isAfter(
                secondParticipant.getRegionalDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnManualResponsibleChangeThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        regionalDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isBefore(
                secondParticipant.getRegionalDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnManualResponsibleChangeThenNoChangesForNonParticipant() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(nonParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        regionalDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);
        Assert.assertNull(nonParticipant.getRegionalDistributionDate());
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isBefore(
                secondParticipant.getRegionalDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleForOldSaleThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(4));

        regionalDistributionService.updateQueueOnArchivedSale(fromDistribution);
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isAfter(
                secondParticipant.getRegionalDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        regionalDistributionService.updateQueueOnArchivedSale(fromDistribution);
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isBefore(
                secondParticipant.getRegionalDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleThenNoChangesForNonParticipant() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);

        firstParticipant.setRegionalDistributionDate(forFirstParticipant);
        secondParticipant.setRegionalDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(nonParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        regionalDistributionService.updateQueueOnArchivedSale(fromDistribution);
        Assert.assertNull(nonParticipant.getRegionalDistributionDate());
        Assert.assertTrue(firstParticipant.getRegionalDistributionDate().isAfter(
                secondParticipant.getRegionalDistributionDate()));
    }
}
