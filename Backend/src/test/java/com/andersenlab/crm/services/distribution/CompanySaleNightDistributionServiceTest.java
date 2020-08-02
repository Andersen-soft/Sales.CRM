package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.configuration.properties.TelegramPropertyUrl;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EmployeeNightDistributionStackEntity;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.repositories.EmployeeNightDistributionStackEntityRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.TelegramService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.NIGHT;
import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

@RunWith(SpringRunner.class)
public class CompanySaleNightDistributionServiceTest {
    private SaleRequestService saleRequestService = mock(SaleRequestService.class);
    private EmployeeService employeeService = mock(EmployeeService.class);
    private EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private TelegramService telegramService = mock(TelegramService.class);
    private CompanySaleTempRepository companySaleTempRepository =
            mock(CompanySaleTempRepository.class);
    private EmployeeNightDistributionStackEntityRepository stackEntityRepository =
            mock(EmployeeNightDistributionStackEntityRepository.class);
    private ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private TelegramProperties telegramProperties = mock(TelegramProperties.class);
    private ApplicationProperties applicationProperties = mock(ApplicationProperties.class);

    private CompanySaleNightDistributionService nightDistributionService =
            new CompanySaleNightDistributionService(
                    employeeService,
                    saleRequestService,
                    employeeRepository,
                    telegramService,
                    companySaleTempRepository,
                    stackEntityRepository,
                    eventPublisher,
                    telegramProperties,
                    applicationProperties
            );

    private Employee firstParticipant;
    private Employee secondParticipant;
    private Employee assistant;
    private Employee nonParticipant;

    private CompanySale inNightDistribution;
    private CompanySale notInDistribution;
    private CompanySale fromDistribution;
    private CompanySaleTemp saleTemp;

    @Before
    public void setUpEntities() {
        TelegramPropertyUrl url = new TelegramPropertyUrl();
        Mockito.doReturn(url).when(telegramProperties).getUrl();

        String timezone = "GMT+3";
        Mockito.doReturn(timezone).when(applicationProperties).getTimezone();

        Role assistantRole = new Role();
        assistantRole.setId(1L);
        assistantRole.setName(RoleEnum.ROLE_SALES_ASSISTANT);

        Employee bot = new Employee();
        bot.setId(73004L);

        String forFirst = "first";
        firstParticipant = new Employee();
        firstParticipant.setId(1L);
        firstParticipant.setLogin(forFirst);
        firstParticipant.setEmail(forFirst);
        firstParticipant.setNightDistributionDate(null);
        firstParticipant.setNightDistributionParticipant(true);
        firstParticipant.setTelegramUsername(forFirst);

        String forSecond = "second";
        secondParticipant = new Employee();
        secondParticipant.setId(2L);
        secondParticipant.setLogin(forSecond);
        secondParticipant.setEmail(forSecond);
        secondParticipant.setNightDistributionDate(null);
        secondParticipant.setNightDistributionParticipant(true);
        secondParticipant.setTelegramUsername(forSecond);

        String forAssistant = "assistant";
        assistant = new Employee();
        assistant.setId(3L);
        assistant.setLogin(forAssistant);
        assistant.setEmail(forAssistant);
        assistant.getRoles().add(assistantRole);
        assistant.setMentor(firstParticipant);
        assistant.setTelegramUsername(forAssistant);

        String forNonParticipant = "non-participant";
        nonParticipant = new Employee();
        nonParticipant.setId(4L);
        nonParticipant.setLogin(forNonParticipant);
        nonParticipant.setEmail(forNonParticipant);
        nonParticipant.setNightDistributionDate(null);
        nonParticipant.setNightDistributionParticipant(false);
        nonParticipant.setTelegramUsername(forNonParticipant);

        Mockito.doReturn(firstParticipant)
                .when(employeeRepository).findEmployeeByTelegramUsername(forFirst);
        Mockito.doReturn(secondParticipant)
                .when(employeeRepository).findEmployeeByTelegramUsername(forSecond);
        Mockito.doReturn(assistant)
                .when(employeeRepository).findEmployeeByTelegramUsername(forAssistant);
        Mockito.doReturn(nonParticipant)
                .when(employeeRepository).findEmployeeByTelegramUsername(forNonParticipant);

        List<Employee> participants = Arrays.asList(firstParticipant, secondParticipant);
        Mockito.doReturn(participants)
                .when(employeeRepository).findAllByNightDistributionParticipantIsTrueAndIsActiveTrue();

        inNightDistribution = new CompanySale();
        inNightDistribution.setId(1L);
        inNightDistribution.setTimeStatus(NIGHT);
        inNightDistribution.setResponsible(bot);

        notInDistribution = new CompanySale();
        notInDistribution.setId(2L);

        fromDistribution = new CompanySale();
        fromDistribution.setId(3L);
        fromDistribution.setTimeStatus(NIGHT);

        saleTemp = new CompanySaleTemp();
        saleTemp.setId(1L);
        saleTemp.setStatus(NIGHT);
        saleTemp.setCompanySale(inNightDistribution);

        Mockito.doReturn(saleTemp)
                .when(companySaleTempRepository).findCompanySaleTempByCompanySaleId(1L);
    }

    @Test
    public void whenEmployeeLikesTempSaleThenSuccess() {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setUserName(firstParticipant.getTelegramUsername());
        telegramDto.setOrderId(inNightDistribution.getId());

        nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto);

        Set<Employee> expectedQueue = new HashSet<>();
        expectedQueue.add(firstParticipant);

        assertEquals(expectedQueue, saleTemp.getEmployeesLiked());
        assertNotNull(saleTemp.getAutoDistributionDate());
    }

    @Test
    public void whenAssistantLikesThenAssignMentorAndSuccess() {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setUserName(assistant.getTelegramUsername());
        telegramDto.setOrderId(inNightDistribution.getId());

        nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto);

        Set<Employee> expectedQueue = new HashSet<>();
        expectedQueue.add(firstParticipant);

        assertEquals(expectedQueue, saleTemp.getEmployeesLiked());
        assertNotNull(saleTemp.getAutoDistributionDate());
    }

    @Test(expected = CrmException.class)
    public void whenNoUserWithTelegramNameThenThrowException() {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setUserName("i-dont-exist");
        telegramDto.setOrderId(inNightDistribution.getId());

        nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto);
    }

    @Test(expected = CrmException.class)
    public void whenNonParticipantLikesTempSaleThenThrowException() {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setUserName(nonParticipant.getTelegramUsername());
        telegramDto.setOrderId(inNightDistribution.getId());

        nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto);
    }

    @Test(expected = CrmException.class)
    public void whenEmployeeLikesNonExistingSaleThenThrowException() {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setUserName(firstParticipant.getTelegramUsername());
        telegramDto.setOrderId(notInDistribution.getId());

        nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto);
    }

    @Test
    public void whenDistributionSaleToEmployeeAndEmployeeDatesNullThenAssignWithLowerId() {
        Set<Employee> distributionQueue = new HashSet<>();
        distributionQueue.add(firstParticipant);
        distributionQueue.add(secondParticipant);
        saleTemp.setEmployeesLiked(distributionQueue);

        nightDistributionService.distributionSaleToEmployee(saleTemp);

        assertEquals(firstParticipant, inNightDistribution.getResponsible());
        assertNotNull(inNightDistribution.getLotteryDate());
        assertNotNull(firstParticipant.getNightDistributionDate());
        assertFalse(firstParticipant.getNightDistributionStack().isEmpty());
        Mockito.verify(saleRequestService, times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenDistributionSaleToEmployeeThenAssignWithEarlierDate() {
        Set<Employee> distributionQueue = new HashSet<>();
        distributionQueue.add(firstParticipant);
        distributionQueue.add(secondParticipant);
        saleTemp.setEmployeesLiked(distributionQueue);

        firstParticipant.setNightDistributionDate(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setNightDistributionDate(LocalDateTime.now().minusMinutes(2));

        nightDistributionService.distributionSaleToEmployee(saleTemp);

        assertEquals(secondParticipant, inNightDistribution.getResponsible());
        assertNotNull(inNightDistribution.getLotteryDate());
        assertTrue(secondParticipant.getNightDistributionDate().isAfter(firstParticipant.getNightDistributionDate()));
        assertFalse(secondParticipant.getNightDistributionStack().isEmpty());
        Mockito.verify(saleRequestService, times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenDistributionSaleToEmployeeThenAssignWithNullDate() {
        Set<Employee> distributionQueue = new HashSet<>();
        distributionQueue.add(firstParticipant);
        distributionQueue.add(secondParticipant);
        saleTemp.setEmployeesLiked(distributionQueue);

        firstParticipant.setNightDistributionDate(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setNightDistributionDate(null);

        nightDistributionService.distributionSaleToEmployee(saleTemp);

        assertEquals(secondParticipant, inNightDistribution.getResponsible());
        assertNotNull(inNightDistribution.getLotteryDate());
        assertTrue(secondParticipant.getNightDistributionDate().isAfter(firstParticipant.getNightDistributionDate()));
        assertFalse(secondParticipant.getNightDistributionStack().isEmpty());
        Mockito.verify(saleRequestService, times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateQueueForOldSaleThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusDays(2);
        LocalDateTime forSecondParticipant = LocalDateTime.now();
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        nightDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);

        assertTrue(firstParticipant.getNightDistributionDate().isBefore(secondParticipant.getNightDistributionDate()));
    }

    @Test
    public void whenUpdateQueueForSaleThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusHours(23);
        LocalDateTime forSecondParticipant = LocalDateTime.now();
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        EmployeeNightDistributionStackEntity stackEntityCurrent = createStackEntity(firstParticipant, forFirstParticipant);
        LocalDateTime forFirstParticipantStack = LocalDateTime.now().minusHours(24);
        EmployeeNightDistributionStackEntity stackEntity = createStackEntity(firstParticipant, forFirstParticipantStack);
        firstParticipant.getNightDistributionStack().add(stackEntity);
        firstParticipant.getNightDistributionStack().add(stackEntityCurrent);

        nightDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);

        assertEquals(forFirstParticipantStack, firstParticipant.getNightDistributionDate());
        assertFalse(firstParticipant.getNightDistributionStack().contains(stackEntityCurrent));
    }

    @Test
    public void whenUpdateQueueForSaleAndEmptyStackThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusHours(23);
        LocalDateTime forSecondParticipant = LocalDateTime.now();
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        LocalDateTime expectedTime = forFirstParticipant.minusMinutes(1);

        nightDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, secondParticipant);

        assertEquals(expectedTime, firstParticipant.getNightDistributionDate());
    }

    @Test
    public void whenUpdateQueueForNonParticipantsThenNoChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(24);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(42);
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        EmployeeNightDistributionStackEntity stackEntityCurrent = createStackEntity(firstParticipant, forFirstParticipant);
        LocalDateTime forFirstParticipantStack = LocalDateTime.now().minusHours(24);
        EmployeeNightDistributionStackEntity stackEntity = createStackEntity(firstParticipant, forFirstParticipantStack);
        firstParticipant.getNightDistributionStack().add(stackEntity);
        firstParticipant.getNightDistributionStack().add(stackEntityCurrent);

        nightDistributionService.updateQueueOnManualResponsibleChange(fromDistribution, nonParticipant);

        assertNull(nonParticipant.getNightDistributionDate());
        assertEquals(forFirstParticipantStack, firstParticipant.getNightDistributionDate());
        assertFalse(firstParticipant.getNightDistributionStack().contains(stackEntityCurrent));
    }

    @Test
    public void whenArchiveOldSaleThenNoQueueChanges() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusDays(2);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusDays(3);
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        nightDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertTrue(firstParticipant.getNightDistributionDate().isAfter(secondParticipant.getNightDistributionDate()));
    }

    @Test
    public void whenArchiveSaleThenUpdateQueue() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusHours(23);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusDays(3);
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        EmployeeNightDistributionStackEntity stackEntityCurrent = createStackEntity(firstParticipant, forFirstParticipant);
        LocalDateTime forFirstParticipantStack = LocalDateTime.now().minusHours(24);
        EmployeeNightDistributionStackEntity stackEntity = createStackEntity(firstParticipant, forFirstParticipantStack);
        firstParticipant.getNightDistributionStack().add(stackEntity);
        firstParticipant.getNightDistributionStack().add(stackEntityCurrent);

        nightDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertEquals(forFirstParticipantStack, firstParticipant.getNightDistributionDate());
        assertFalse(firstParticipant.getNightDistributionStack().contains(stackEntityCurrent));
    }

    @Test
    public void whenArchiveSaleAndEmptyStackThenUpdateQueue() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusHours(23);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusDays(3);
        fromDistribution.setLotteryDate(forFirstParticipant);
        fromDistribution.setResponsible(firstParticipant);
        firstParticipant.setNightDistributionDate(forFirstParticipant);
        secondParticipant.setNightDistributionDate(forSecondParticipant);

        LocalDateTime expectedTime = forSecondParticipant.minusMinutes(1);

        nightDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertEquals(expectedTime, firstParticipant.getNightDistributionDate());
    }

    @Test
    public void whenArchiveSaleWithNonParticipantThenNoChanges() {
        LocalDateTime distributionDate = LocalDateTime.now().minusHours(23);
        fromDistribution.setLotteryDate(distributionDate);
        fromDistribution.setResponsible(nonParticipant);

        nightDistributionService.updateQueueOnArchivedSale(fromDistribution);

        assertNull(nonParticipant.getNightDistributionDate());
    }

    private EmployeeNightDistributionStackEntity createStackEntity(Employee target, LocalDateTime time) {
        EmployeeNightDistributionStackEntity stackEntity = new EmployeeNightDistributionStackEntity();
        stackEntity.setEmployee(target);
        stackEntity.setTime(time);

        return stackEntity;
    }
}
