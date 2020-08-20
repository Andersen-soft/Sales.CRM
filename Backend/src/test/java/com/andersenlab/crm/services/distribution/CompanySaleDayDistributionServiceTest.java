package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.rest.dto.DayDistributionEmployeeDto;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.WsSender;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.DAY;
import static com.andersenlab.crm.utils.CrmTopicConstants.TOPIC_AUTO_DISTRIBUTION_DAY_EMPLOYEE_ASSIGNED;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

@RunWith(SpringRunner.class)
public class CompanySaleDayDistributionServiceTest {
    private SaleRequestService saleRequestService = mock(SaleRequestService.class);
    private EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private CompanySaleTempRepository companySaleTempRepository = mock(CompanySaleTempRepository.class);
    private ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private WsSender wsSender = mock(WsSender.class);

    private Employee firstParticipant;
    private Employee secondParticipant;
    private Employee nonParticipant;

    private CompanySale inDayDistribution;
    private CompanySale fromDistribution;
    private CompanySaleTemp saleTemp;

    private CompanySaleDayDistributionService dayDistributionService = new CompanySaleDayDistributionService(
            employeeRepository,
            companySaleTempRepository,
            saleRequestService,
            eventPublisher,
            wsSender
    );

    @Before
    public void setUpEntities() {
        Employee bot = new Employee();
        bot.setId(73004L);

        // Sonarqube fix.
        Consumer<DayDistributionEmployeeDto> mockedConsumer = v -> v.setCompanyName(v.getCompanyName());
        doReturn(mockedConsumer)
                .when(wsSender).getSender(TOPIC_AUTO_DISTRIBUTION_DAY_EMPLOYEE_ASSIGNED);

        String forFirst = "first";
        firstParticipant = new Employee();
        firstParticipant.setId(1L);
        firstParticipant.setLogin(forFirst);
        firstParticipant.setEmail(forFirst);
        firstParticipant.setDayDistributionDate(null);
        firstParticipant.setDayDistributionParticipant(true);
        firstParticipant.setTelegramUsername(forFirst);

        String forSecond = "second";
        secondParticipant = new Employee();
        secondParticipant.setId(2L);
        secondParticipant.setLogin(forSecond);
        secondParticipant.setEmail(forSecond);
        secondParticipant.setDayDistributionDate(null);
        secondParticipant.setDayDistributionParticipant(true);
        secondParticipant.setTelegramUsername(forSecond);

        String forNonParticipant = "non-participant";
        nonParticipant = new Employee();
        nonParticipant.setId(4L);
        nonParticipant.setLogin(forNonParticipant);
        nonParticipant.setEmail(forNonParticipant);
        nonParticipant.setDayDistributionDate(null);
        nonParticipant.setDayDistributionParticipant(false);
        nonParticipant.setTelegramUsername(forNonParticipant);

        List<Employee> participants = Arrays.asList(firstParticipant, secondParticipant);
        doReturn(participants)
                .when(employeeRepository).findAllByDayDistributionParticipantIsTrueAndIsActiveTrue();

        Company mockedCompany = new Company();
        mockedCompany.setId(1L);
        mockedCompany.setName("my life for the horde");

        inDayDistribution = new CompanySale();
        inDayDistribution.setId(1L);
        inDayDistribution.setTimeStatus(DAY);
        inDayDistribution.setResponsible(bot);
        inDayDistribution.setCompany(mockedCompany);

        CompanySale notInDistribution = new CompanySale();
        notInDistribution.setId(2L);

        fromDistribution = new CompanySale();
        fromDistribution.setId(3L);
        fromDistribution.setTimeStatus(DAY);

        saleTemp = new CompanySaleTemp();
        saleTemp.setId(1L);
        saleTemp.setStatus(DAY);
        saleTemp.setCompanySale(inDayDistribution);

        doReturn(saleTemp)
                .when(companySaleTempRepository).findCompanySaleTempByCompanySaleId(1L);
    }

    @Test
    public void whenAutoDistributionDayEmployeeThenAssignNext() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        saleTemp.setResponsible(secondParticipant);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        saleTemp.getDayDistributionQueue().add(firstParticipant);
        saleTemp.getDayDistributionQueue().add(secondParticipant);

        dayDistributionService.autoDistributionDayEmployee(saleTemp.getCompanySale(), saleTemp);

        assertEquals(firstParticipant, saleTemp.getResponsible());
        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
        assertFalse(saleTemp.getDayDistributionQueue().contains(secondParticipant));
    }

    @Test
    public void whenAutoDistributionDayEmployeeAndEmptyQueueThenCreateNewQueue() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(2);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(1);
        saleTemp.setResponsible(secondParticipant);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        saleTemp.getDayDistributionQueue().add(secondParticipant);

        dayDistributionService.autoDistributionDayEmployee(saleTemp.getCompanySale(), saleTemp);

        assertEquals(firstParticipant, saleTemp.getResponsible());
        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
        assertFalse(saleTemp.getDayDistributionQueue().isEmpty());
        assertTrue(saleTemp.getDayDistributionQueue().contains(firstParticipant));
        assertTrue(saleTemp.getDayDistributionQueue().contains(secondParticipant));
    }

    @Test
    public void whenAssignSaleToEmployeeThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(2);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(1);
        saleTemp.setResponsible(firstParticipant);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        dayDistributionService.assignSaleToEmployee(saleTemp);

        assertEquals(firstParticipant, inDayDistribution.getResponsible());
        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
        Mockito.verify(saleRequestService, times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateQueueOnResponsibleChangeForOldSaleThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(4));

        dayDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);

        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnResponsibleChangeThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        dayDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);

        LocalDateTime expectedTime = forSecondParticipant.minusMinutes(1);
        assertTrue(firstParticipant.getDayDistributionDate().isBefore(secondParticipant.getDayDistributionDate()));
        assertEquals(expectedTime, firstParticipant.getDayDistributionDate());
    }

    @Test
    public void whenUpdateQueueOnResponsibleChangeForNonParticipantsThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(2);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(1);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(nonParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        dayDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, firstParticipant);

        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
        assertNull(nonParticipant.getDayDistributionDate());
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleForOldSaleThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(4));

        dayDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertTrue(firstParticipant.getDayDistributionDate().isAfter(secondParticipant.getDayDistributionDate()));
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        fromDistribution.setResponsible(firstParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        dayDistributionService.updateQueueOnArchivedSale(fromDistribution);

        LocalDateTime expectedTime = forSecondParticipant.minusMinutes(1);
        assertTrue(firstParticipant.getDayDistributionDate().isBefore(secondParticipant.getDayDistributionDate()));
        assertEquals(expectedTime, firstParticipant.getDayDistributionDate());
    }

    @Test
    public void whenUpdateQueueOnArchivedSaleForNonParticipantsThenNoChanges() {
        fromDistribution.setResponsible(nonParticipant);
        fromDistribution.setLotteryDate(LocalDateTime.now().minusDays(2));

        dayDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertNull(nonParticipant.getDayDistributionDate());
    }

    @Test
    public void whenUpdateQueueOnSaleRemovedFromDistributionThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(1);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        firstParticipant.setDayDistributionDate(forFirstParticipant);
        secondParticipant.setDayDistributionDate(forSecondParticipant);

        saleTemp.setResponsible(firstParticipant);

        dayDistributionService.updateQueueOnSaleRemovedFromDistribution(inDayDistribution);

        LocalDateTime expectedTime = forSecondParticipant.minusMinutes(1);
        assertTrue(firstParticipant.getDayDistributionDate().isBefore(secondParticipant.getDayDistributionDate()));
        assertEquals(expectedTime, firstParticipant.getDayDistributionDate());
    }
}
