package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyDistributionHistory;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.CompanyDistributionHistoryService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

public class CompanyDDDistributionServiceTest {
    private EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private CompanyDistributionHistoryService companyDistributionHistoryService = mock(CompanyDistributionHistoryService.class);
    private ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);

    private CompanyDDDistributionService companyDistributionService = new CompanyDDDistributionService(
            companyDistributionHistoryService,
            employeeRepository,
            eventPublisher
    );

    private Employee firstParticipant;
    private Employee secondParticipant;
    private Employee nonParticipant;

    private Company withoutDD;
    private Company withDD;
    private Company referenceWithoutDD;
    private Company referenceWithDD;

    private CompanySale saleWithReference;
    private CompanySale saleWithoutReference;

    @Before
    public void setUpEntities() {
        String forFirst = "first";
        firstParticipant = new Employee();
        firstParticipant.setId(1L);
        firstParticipant.setLogin(forFirst);
        firstParticipant.setEmail(forFirst);
        firstParticipant.setDistributionDateRm(null);
        firstParticipant.setResponsibleRM(true);

        String forSecond = "second";
        secondParticipant = new Employee();
        secondParticipant.setId(2L);
        secondParticipant.setLogin(forSecond);
        secondParticipant.setEmail(forSecond);
        secondParticipant.setDistributionDateRm(null);
        secondParticipant.setResponsibleRM(true);

        String forNonParticipant = "non-participant";
        nonParticipant = new Employee();
        nonParticipant.setId(4L);
        nonParticipant.setLogin(forNonParticipant);
        nonParticipant.setEmail(forNonParticipant);
        nonParticipant.setDistributionDateRm(null);
        nonParticipant.setResponsibleRM(false);

        when(employeeRepository.findByResponsibleRMAndIsActiveTrue(true))
                .thenReturn(Arrays.asList(firstParticipant, secondParticipant));

        withDD = new Company();
        withDD.setId(1L);
        withDD.setName("company with DD");
        withDD.setResponsible(nonParticipant);

        withoutDD = new Company();
        withoutDD.setId(2L);
        withoutDD.setName("company with no DD");
        withoutDD.setResponsible(null);

        referenceWithDD = new Company();
        referenceWithDD.setId(3L);
        referenceWithDD.setName("reference company with DD");
        referenceWithDD.setResponsible(firstParticipant);

        referenceWithoutDD = new Company();
        referenceWithoutDD.setId(4L);
        referenceWithoutDD.setName("reference company without DD");
        referenceWithoutDD.setResponsible(null);

        Source sourceReference = new Source();
        sourceReference.setId(1L);
        sourceReference.setNameEn("Recommendation");

        saleWithReference = new CompanySale();
        saleWithReference.setId(1L);
        saleWithReference.setCompany(withoutDD);
        saleWithReference.setSource(sourceReference);
        saleWithReference.setRecommendedBy(referenceWithDD);

        Source sourceMail = new Source();
        sourceMail.setId(2L);
        sourceMail.setNameEn("Mail");

        saleWithoutReference = new CompanySale();
        saleWithoutReference.setId(2L);
        saleWithoutReference.setCompany(withoutDD);
        saleWithoutReference.setSource(sourceMail);
        saleWithoutReference.setRecommendedBy(null);
    }

    @Test
    public void whenAssignDeliveryDirectorThenAssignWithMinTime() {
        firstParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(2));

        companyDistributionService.assignDeliveryDirector(withoutDD);
        Assert.assertEquals(secondParticipant, withoutDD.getResponsible());
        Assert.assertTrue(secondParticipant.getDistributionDateRm().isAfter(firstParticipant.getDistributionDateRm()));
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignDeliveryDirectorThenAssignWithNullTime() {
        firstParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setDistributionDateRm(null);

        companyDistributionService.assignDeliveryDirector(withoutDD);
        Assert.assertEquals(secondParticipant, withoutDD.getResponsible());
        Assert.assertTrue(secondParticipant.getDistributionDateRm().isAfter(firstParticipant.getDistributionDateRm()));
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignDeliveryDirectorThenAssignWithLowerId() {
        firstParticipant.setDistributionDateRm(null);
        secondParticipant.setDistributionDateRm(null);

        companyDistributionService.assignDeliveryDirector(withoutDD);
        Assert.assertEquals(firstParticipant, withoutDD.getResponsible());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
    }

    @Test
    public void whenAssignDeliveryDirectorAndAlreadyExistsThenDoNothing() {
        companyDistributionService.assignDeliveryDirector(withDD);

        Assert.assertEquals(nonParticipant, withDD.getResponsible());

        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignFromReferenceCompanyThenSuccess() {
        saleWithReference.setCompany(withoutDD);
        companyDistributionService.assignDeliveryDirectorByReferenceCompany(saleWithReference, referenceWithDD);

        Assert.assertEquals(firstParticipant, withoutDD.getResponsible());
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignFromReferenceCompanyAndAlreadyExistsThenDoNothing() {
        saleWithReference.setCompany(withDD);
        companyDistributionService.assignDeliveryDirectorByReferenceCompany(saleWithReference, referenceWithDD);

        Assert.assertEquals(nonParticipant, withDD.getResponsible());
        Assert.assertNotEquals(firstParticipant, withDD.getResponsible());
        Assert.assertNull(withDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignFromReferenceCompanyAndReferenceHasNullThenAssignFromQueue() {
        firstParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(2));

        saleWithReference.setRecommendedBy(referenceWithoutDD);
        companyDistributionService.assignDeliveryDirectorByReferenceCompany(saleWithReference, referenceWithoutDD);

        Assert.assertEquals(secondParticipant, withoutDD.getResponsible());
        Assert.assertTrue(secondParticipant.getDistributionDateRm().isAfter(firstParticipant.getDistributionDateRm()));
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenAssignFromReferenceCompanyAndReferenceIsNullThenAssignFromQueue() {
        firstParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(1));
        secondParticipant.setDistributionDateRm(LocalDateTime.now().minusMinutes(2));

        companyDistributionService.assignDeliveryDirectorByReferenceCompany(saleWithoutReference, null);

        Assert.assertEquals(secondParticipant, withoutDD.getResponsible());
        Assert.assertTrue(secondParticipant.getDistributionDateRm().isAfter(firstParticipant.getDistributionDateRm()));
        Assert.assertNotNull(withoutDD.getDdAssignmentDate());
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenUpdateDistributionQueueForOldCompanyDdAssignmentDateThenChangeAssignmentTime() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(3);
        firstParticipant.setDistributionDateRm(forFirstParticipant);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        secondParticipant.setDistributionDateRm(forSecondParticipant);
        LocalDateTime forNonParticipant = LocalDateTime.now().minusMinutes(1);
        nonParticipant.setDistributionDateRm(forNonParticipant);

        LocalDateTime assignmentTime = LocalDateTime.now().minusDays(4);
        withDD.setDdAssignmentDate(LocalDateTime.now().minusDays(4));

        companyDistributionService.updateDistributionQueue(withDD, firstParticipant);

        Assert.assertEquals(forFirstParticipant, firstParticipant.getDistributionDateRm());
        Assert.assertEquals(forNonParticipant, nonParticipant.getDistributionDateRm());
        Assert.assertNotEquals(assignmentTime, withDD.getDdAssignmentDate());
        Assert.assertTrue(withDD.getDdAssignmentDate().isAfter(assignmentTime));
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }

    @Test
    public void whenUpdateDistributionQueueThenSuccess() {
        LocalDateTime forFirstParticipant = LocalDateTime.now().minusMinutes(3);
        firstParticipant.setDistributionDateRm(forFirstParticipant);
        LocalDateTime forSecondParticipant = LocalDateTime.now().minusMinutes(2);
        secondParticipant.setDistributionDateRm(forSecondParticipant);
        LocalDateTime forNonParticipant = LocalDateTime.now().minusMinutes(1);
        nonParticipant.setDistributionDateRm(forNonParticipant);

        LocalDateTime assignmentTime = LocalDateTime.now().minusDays(2);
        withDD.setDdAssignmentDate(assignmentTime);

        companyDistributionService.updateDistributionQueue(withDD, firstParticipant);

        LocalDateTime timeForFirstParticipant = forFirstParticipant.minusMinutes(1);
        Assert.assertTrue(firstParticipant.getDistributionDateRm().isAfter(nonParticipant.getDistributionDateRm()));
        Assert.assertEquals(timeForFirstParticipant, nonParticipant.getDistributionDateRm());
        Assert.assertNotEquals(assignmentTime, withDD.getDdAssignmentDate());
        Assert.assertTrue(withDD.getDdAssignmentDate().isAfter(assignmentTime));
        Mockito.verify(companyDistributionHistoryService, times(1)).create(any(CompanyDistributionHistory.class));
    }
}
