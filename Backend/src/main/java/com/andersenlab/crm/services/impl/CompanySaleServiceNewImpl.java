package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.CompanySaleArchivedEvent;
import com.andersenlab.crm.events.CompanySaleAssignedEmailEmployeeNotifierEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.CompanySaleHistoryRepository;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.TelegramService;
import com.andersenlab.crm.services.distribution.CompanyDDDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleRegionalDistributionService;
import com.andersenlab.crm.utils.CrmStringUtils;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.andersenlab.crm.model.entities.CompanySale.Status.ARCHIVE;
import static com.andersenlab.crm.model.entities.CompanySale.Status.CONTRACT;
import static com.andersenlab.crm.model.entities.CompanySale.Status.OPPORTUNITY;
import static com.andersenlab.crm.model.entities.CompanySale.Status.PRELEAD;
import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.DAY;
import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.NIGHT;
import static com.andersenlab.crm.model.entities.CompanySaleTemp.Status.REGIONAL;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_REFERENCE;
import static com.andersenlab.crm.utils.ServiceUtils.getEnumNames;
import static com.andersenlab.crm.utils.ServiceUtils.isEmployeeCrmBot;
import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor
public class CompanySaleServiceNewImpl implements CompanySaleServiceNew {
    private final CompanySaleRepository companySaleRepository;
    private final CompanySaleTempRepository companySaleTempRepository;
    private final CompanySaleHistoryRepository historyRepository;
    private final CompanySaleTempService companySaleTempService;
    private final CompanySaleGoogleAdRecordService googleAdRecordService;
    private final SaleRequestService saleRequestService;
    private final CompanyDDDistributionService companyDistributionService;
    private final CompanySaleDayDistributionService dayDistributionService;
    private final CompanySaleNightDistributionService nightDistributionService;
    private final CompanySaleRegionalDistributionService regionalDistributionService;
    private final TelegramService telegramService;
    private final AuthenticatedUser authenticatedUser;
    private final ApplicationEventPublisher eventPublisher;
    private final ApplicationProperties applicationProperties;
    private final TelegramProperties telegramProperties;
    private final ConversionService conversionService;

    @Override
    @Transactional(readOnly = true)
    public CompanySale findById(long id) {
        return companySaleRepository.getOne(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanySale> findPreviousCompanySalesByContactEmailOrPhone(
            LocalDateTime lookup, String email, String phone) {
        LocalDateTime from = lookup.minusDays(1);
        return companySaleRepository.findByContactEmailOrPhone(from, lookup, email, phone);
    }

    @Override
    @Transactional
    public CompanySale createSale(CompanySale sale) {
        CompanySale persistedSale = companySaleRepository.saveAndFlush(sale);

        // This logic remains in sale service (not in company service) because:
        // 1. By algorithm, DD is checked every time SALE, not COMPANY, is created or updated
        // 2. Reference company is assigned to SALE, not COMPANY, and its impossible to properly check for DD
        //    every time COMPANY is created
        // As soon as company is moved as independent entity, this logic should be moved to company service.
        companyDistributionService.assignDeliveryDirectorByReferenceCompany(
                persistedSale, persistedSale.getRecommendedBy());
        if (!ARCHIVE.equals(sale.getStatus())
                && isEmployeeCrmBot(sale.getResponsible())) {
            moveSaleToDistribution(sale);
        }

        return persistedSale;
    }

    @Override
    @Transactional(readOnly = true)
    public CompanySale findCompanySaleByIdOrThrowException(Long id) {
        if (id == -1) {
            return null;
        }
        return ofNullable(companySaleRepository.findByIsActiveIsTrueAndId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public CompanySaleResponse getCompanySaleResponseById(Long id) {
        CompanySale companySale = findCompanySaleByIdOrThrowException(id);
        CompanySaleResponse response = conversionService.convert(
                companySale, CompanySaleResponse.class);
        if (companySale.isInDayAutoDistribution()) {
            CompanySaleTemp saleTemp =
                    companySaleTempRepository.findCompanySaleTempByCompanySaleId(id);
            Optional.ofNullable(saleTemp)
                    .ifPresent(sale -> response.setDistributedEmployeeId(
                            saleTemp.getResponsible().getId()));
        }
        return response;
    }

    @Override
    public List<HistoryDto> getCompanySaleHistoryById(Long id, Locale locale) {
        return conversionService.convertToListWithLocale(
                historyRepository.findAllByCompanySaleId(id), HistoryDto.class, locale);
    }

    @Override
    public List<String> getStatuses() {
        return getEnumNames(CompanySale.Status.class);
    }

    @Override
    public Long getCompanySalesWithPastActivitiesCount() {
        return companySaleRepository.getPastCompanySalesCount(authenticatedUser.getCurrentEmployee());
    }

    @Override
    public Map<String, String> getSalesCountByStatuses() {
        return companySaleRepository.getSalesCountByStatusesOfCurrentUser(authenticatedUser.getCurrentEmployee())
                .stream()
                .collect(Collectors.toMap(k -> k[0].toString(), v -> v[1].toString()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanySale> getCompanySales(Predicate predicate, Pageable pageable) {
        return companySaleRepository.findAll(predicate, pageable);
    }

    @Override
    @Transactional
    public CompanySale updateSaleById(long id, CompanySale updatedSale) {
        final CompanySale persisted = companySaleRepository.getOne(id);
        checkIfCanUpdate(persisted);

        boolean isOldSaleInDistribution = isEmployeeCrmBot(persisted.getResponsible())
                && !ARCHIVE.equals(persisted.getStatus());

        Optional.ofNullable(updatedSale.getResponsible())
                .ifPresent(newResponsible -> updateResponsible(persisted, isOldSaleInDistribution, newResponsible));
        Optional.ofNullable(updatedSale.getStatus())
                .ifPresent(newStatus -> updateStatus(persisted, newStatus));
        persisted.setCategory(updatedSale.getCategory());
        Optional.ofNullable(updatedSale.getMainContact())
                .ifPresent(contact -> updateContact(persisted, contact));
        Optional.ofNullable(updatedSale.getCompany())
                .ifPresent(company -> updateCompany(persisted, company));
        Optional.ofNullable(updatedSale.getSource())
                .ifPresent(newSource -> updateSource(persisted, newSource));
        Optional.ofNullable(updatedSale.getRecommendedBy())
                .ifPresent(reference -> updateReferenceCompany(persisted, reference));
        Optional.ofNullable(updatedSale.getDescription())
                .map(CrmStringUtils::fixStringDescription)
                .ifPresent(persisted::setDescription);
        Optional.ofNullable(updatedSale.getNextActivityDate())
                .ifPresent(persisted::setNextActivityDate);
        Optional.ofNullable(updatedSale.getWeight())
                .ifPresent(persisted::setWeight);

        boolean isNewSaleInDistribution = isEmployeeCrmBot(persisted.getResponsible())
                && !ARCHIVE.equals(persisted.getStatus());

        if (isOldSaleInDistribution && !isNewSaleInDistribution) {
            removeSaleFromDistribution(persisted);
        }

        if (!isOldSaleInDistribution && isNewSaleInDistribution) {
            moveSaleToDistribution(persisted);
        }

        return companySaleRepository.saveAndFlush(persisted);
    }

    @Override
    @Transactional
    public void deleteCompanySale(Long id) {
        CompanySale companySale = findCompanySaleByIdOrThrowException(id);
        validateDeleteCompanySaleRequest(companySale.getActivities(), companySale.getResumeRequests(), companySale.getEstimationRequests());
        companySale.setIsActive(false);
        updateSaleDistributionQueueOnArchivedSale(companySale);
        companySaleTempService.deleteOnArchivedSale(companySale);
        companySale.setInDayAutoDistribution(false);
        companySaleRepository.saveAndFlush(companySale);
    }

    private void checkIfCanUpdate(CompanySale companySale) {
        if (companySale == null) {
            throw new ResourceNotFoundException("Sale not found");
        }
        Employee currentEmployee = authenticatedUser.getCurrentEmployee();
        boolean isSalesHead = currentEmployee.getRoles().stream()
                .anyMatch(role -> RoleEnum.ROLE_SALES_HEAD.equals(role.getName()));
        boolean isResponsibleCurrentEmployee = companySale.getResponsible() != null
                && companySale.getResponsible().equals(currentEmployee.getResponsible());
        if (!isSalesHead && !isResponsibleCurrentEmployee) {
            throw new CrmException("You can not update a company sale belongs to another sales");
        }
    }

    private void updateResponsible(CompanySale companySale, boolean isOldSaleInDistribution, Employee newResponsible) {
        if (!isOldSaleInDistribution) {
            updateDistributionQueueOnResponsibleChange(companySale, newResponsible);
        } else {
            if (NIGHT.equals(companySale.getTimeStatus())) {
                TelegramDto telegramDto = telegramService.createDto(
                        companySale.getId(),
                        Optional.ofNullable(newResponsible.getTelegramUsername())
                                .orElse(newResponsible.getFirstName() + " " + newResponsible.getLastName())
                );

                telegramService.send(telegramDto, telegramProperties.getUrl().getPostAssignmentEmployee());
            }
        }

        boolean isChangeResponsible = !companySale.getResponsible().equals(newResponsible);

        companySale.setResponsible(newResponsible);
        if (!isEmployeeCrmBot(newResponsible)) {
            saleRequestService.assignResponsibleForAllRequestsByCompanySale(companySale, newResponsible);
            if (isChangeResponsible && !authenticatedUser.getCurrentEmployee().equals(newResponsible)) {
                String salesUrl = applicationProperties.getUrl() + "/sales/" + companySale.getId();
                manualChangeResponsibleMailNotification(companySale, salesUrl, newResponsible);
            }
        }
    }

    private void updateDistributionQueueOnResponsibleChange(CompanySale companySale, Employee newResponsible) {
        if (DAY.equals(companySale.getTimeStatus())) {
            dayDistributionService.updateQueueOnManualResponsibleChange(companySale, newResponsible);
        }
        if (NIGHT.equals(companySale.getTimeStatus())) {
            nightDistributionService.updateQueueOnManualResponsibleChange(companySale, newResponsible);
        }
        if (REGIONAL.equals(companySale.getTimeStatus())) {
            regionalDistributionService.updateQueueOnManualResponsibleChange(companySale, newResponsible);
        }
    }

    private boolean isSourceChangedFromReference(Source oldSource, Source newSource) {
        if (oldSource != null) {
            return SOURCE_NAME_REFERENCE.equalsIgnoreCase(oldSource.getNameEn())
                    && newSource != null
                    && !SOURCE_NAME_REFERENCE.equalsIgnoreCase(newSource.getNameEn());
        } else {
            return false;
        }
    }

    private void updateStatus(CompanySale companySale, CompanySale.Status newStatus) {
        if (isStatusChangedFromArchive(companySale.getStatus(), newStatus)) {
            companyDistributionService.assignDeliveryDirectorByReferenceCompany(companySale, companySale.getRecommendedBy());
        }
        if (isStatusChangedToLead(companySale.getStatus(), newStatus)) {
            companySale.setCreateLeadDate(LocalDateTime.now());
        }
        companySale.setStatus(newStatus);

        if (ARCHIVE.equals(newStatus)) {
            updateDistributionQueueOnStatusArchive(companySale);
            eventPublisher.publishEvent(CompanySaleArchivedEvent.builder()
                    .companySale(companySale)
                    .whoArchived(authenticatedUser.getCurrentEmployee())
                    .build());
        }
        companySale.setStatusChangedDate(LocalDateTime.now());

        if (isStatusChangedForGoogleAdConversion(newStatus)) {
            googleAdRecordService.updateRecordOnSaleStatusChanged(companySale);
        }
    }

    private boolean isStatusChangedToLead(CompanySale.Status oldStatus, CompanySale.Status newStatus) {
        boolean previousStatusNotLead = ARCHIVE.equals(oldStatus)
                || PRELEAD.equals(oldStatus);
        boolean newStatusLead = !(ARCHIVE.equals(newStatus)
                || PRELEAD.equals(newStatus));

        return previousStatusNotLead && newStatusLead;
    }

    private boolean isStatusChangedFromArchive(CompanySale.Status oldStatus, CompanySale.Status newStatus) {
        boolean previousStatusIsArchive = ARCHIVE.equals(oldStatus);
        boolean newStatusIsNotArchive = !(ARCHIVE.equals(newStatus));

        return previousStatusIsArchive && newStatusIsNotArchive;
    }

    private boolean isStatusChangedForGoogleAdConversion(CompanySale.Status newStatus) {
        return OPPORTUNITY.equals(newStatus)
                || CONTRACT.equals(newStatus);
    }

    private void updateDistributionQueueOnStatusArchive(CompanySale companySale) {
        if (DAY.equals(companySale.getTimeStatus())) {
            dayDistributionService.updateQueueOnArchivedSale(companySale);
        }
        if (NIGHT.equals(companySale.getTimeStatus())) {
            nightDistributionService.updateQueueOnArchivedSale(companySale);
        }
        if (REGIONAL.equals(companySale.getTimeStatus())) {
            regionalDistributionService.updateQueueOnArchivedSale(companySale);
        }
    }

    private void updateContact(CompanySale companySale, Contact contact) {
        companySale.setMainContact(contact);

        if (!ARCHIVE.equals(companySale.getStatus())
                && isEmployeeCrmBot(companySale.getResponsible())) {
            checkForNewRegionalEmployee(companySale);
        }
    }

    private void updateCompany(CompanySale companySale, Company company) {
        companySale.setCompany(company);

        if (companySale.getMainContact() != null
                && !companySale.getMainContact().getCompany().equals(companySale.getCompany())) {
            companySale.setMainContact(null);
        }
    }

    private void updateSource(CompanySale companySale, Source newSource) {
        if (isSourceChangedFromReference(companySale.getSource(), newSource)) {
            companySale.setRecommendedBy(null);
        }
        companySale.setSource(newSource);
    }

    private void updateReferenceCompany(CompanySale companySale, Company reference) {
        if (reference.getId() != -1L) {
            if (SOURCE_NAME_REFERENCE.equalsIgnoreCase(companySale.getSource().getNameEn())) {
                companySale.setRecommendedBy(reference);
                companyDistributionService.assignDeliveryDirectorByReferenceCompany(companySale, reference);
            }
        } else {
            companySale.setRecommendedBy(null);
        }
    }

    private void moveSaleToDistribution(CompanySale companySale) {
        Employee regionalEmployee = regionalDistributionService.findNextRegionalEmployeeByCountry(
                companySale.getMainContact().getCountry());
        if (regionalEmployee != null) {
            companySale.setResponsible(regionalEmployee);
            regionalDistributionService.setResponsibleRegionalEmployeeAndMailNotify(
                    companySale, regionalEmployee);

            companySale.setTimeStatus(REGIONAL);
        } else {
            companySale.setTimeStatus(companySaleTempService.defineCompanySaleTempStatus());
            if (DAY.equals(companySale.getTimeStatus())) {
                companySale.setInDayAutoDistribution(true);
            }

            companySaleTempService.createCompanySaleTempAndNotifier(companySale);
        }
    }

    private void checkForNewRegionalEmployee(CompanySale companySale) {
        Employee regionalEmployee = regionalDistributionService.findNextRegionalEmployeeByCountry(
                companySale.getMainContact().getCountry());
        if (regionalEmployee != null) {
            companySale.setResponsible(regionalEmployee);
            regionalDistributionService.setResponsibleRegionalEmployeeAndMailNotify(
                    companySale, regionalEmployee);

            companySale.setTimeStatus(REGIONAL);
            companySale.setInDayAutoDistribution(false);
        }
    }

    private void removeSaleFromDistribution(CompanySale companySale) {
        companySale.setInDayAutoDistribution(false);

        if (DAY.equals(companySale.getTimeStatus())) {
            dayDistributionService.updateQueueOnSaleRemovedFromDistribution(companySale);
            dayDistributionService.notifyAboutCompanySaleRemovedFromDistribution(companySale);
        }

        companySaleTempService.deleteByCorrespondingCompanySale(companySale);
    }

    private void updateSaleDistributionQueueOnArchivedSale(CompanySale companySale) {
        if (DAY.equals(companySale.getTimeStatus())) {
            if (companySale.isInDayAutoDistribution()) {
                dayDistributionService.updateQueueOnSaleRemovedFromDistribution(companySale);
                dayDistributionService.notifyAboutCompanySaleRemovedFromDistribution(companySale);
            } else {
                dayDistributionService.updateQueueOnArchivedSale(companySale);
            }
        }

        if (NIGHT.equals(companySale.getTimeStatus())) {
            nightDistributionService.updateQueueOnArchivedSale(companySale);
        }

        if (REGIONAL
                .equals(companySale.getTimeStatus())) {
            regionalDistributionService.updateQueueOnArchivedSale(companySale);
        }
    }

    private void manualChangeResponsibleMailNotification(CompanySale sale, String salesUrl, Employee responsibleEmployee) {
        eventPublisher.publishEvent(CompanySaleAssignedEmailEmployeeNotifierEvent
                .builder()
                .companyName(sale.getCompanyName())
                .isAutoChange(false)
                .salesUrl(salesUrl)
                .responsibleFrom(authenticatedUser.getCurrentEmployee())
                .responsibleTo(responsibleEmployee)
                .userEmail(responsibleEmployee.getEmail())
                .userLocale(responsibleEmployee.getEmployeeLang())
                .build());
    }

    private void validateDeleteCompanySaleRequest(List<Activity> activities, List<ResumeRequest> resumeRequests, List<EstimationRequest> estimationRequests) {
        if (!activities.isEmpty() || !resumeRequests.isEmpty() || !estimationRequests.isEmpty()) {
            throw new CrmException("You can't delete sale with activities, resume requests or estimation requests.");
        }
    }
}
