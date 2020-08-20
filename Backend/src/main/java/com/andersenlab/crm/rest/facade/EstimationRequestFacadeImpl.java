package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmExceptionWithBody;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.EstimationRequestOldDto;
import com.andersenlab.crm.rest.response.EstimationRequestResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.EstimationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EstimationRequestFacadeImpl implements EstimationRequestFacade {

    private final EstimationRequestService estimationRequestService;
    private final AuthenticatedUser authenticatedUser;
    private final CompanyService companyService;
    private final ConversionService conversionService;

    @Override
    public BaseResponse createOldRequest(EstimationRequestOldDto dto) {
        validateCreate(dto);
        EstimationRequest request = conversionService.convert(dto, EstimationRequest.class);
        request.setIsActive(true);
        request.setAuthor(authenticatedUser.getCurrentEmployee());
        request.setStatus(EstimationRequest.Status.ESTIMATION_NEED);
        EstimationRequest createdRequest = estimationRequestService.create(request);
        return new BaseResponse<>(conversionService.convert(createdRequest, EstimationRequestOldDto.class));
    }

    @Override
    public BaseResponse updateOldRequest(EstimationRequestOldDto dto) {
        validateUpdate(dto);
        EstimationRequest request = conversionService.convert(dto, EstimationRequest.class);
        request.setId(dto.getId());
        companyService.validateById(dto.getCompanyId());
        Company company = new Company();
        company.setId(dto.getCompanyId());
        request.setCompany(company);
        EstimationRequestResponse createdRequest = conversionService.convert(
                estimationRequestService.updateRequest(request), EstimationRequestResponse.class);
        return new BaseResponse<>(conversionService.convert(createdRequest, EstimationRequestOldDto.class));
    }

    private void validateUpdate(EstimationRequestOldDto dto) {
        estimationRequestService.validateById(dto.getId());
        validateByOldIdIsNotExist(dto);
        companyService.validateById(dto.getCompanyId());
    }

    private void validateCreate(EstimationRequestOldDto dto) {
        dto.setId(null);
        validateOldId(dto);
        companyService.validateById(dto.getCompanyId());
        validateByOldIdIsNotExist(dto);
    }

    private void validateByOldIdIsNotExist(EstimationRequestOldDto dto) {
        EstimationRequest entity = estimationRequestService.getByOldId(dto.getOldId());
        if (entity != null && !entity.getId().equals(dto.getId())) {
            throw new CrmExceptionWithBody("Запрос на оценку с old_id = " + dto.getOldId() + " уже существует",
                    conversionService.convert(entity, EstimationRequestOldDto.class));
        }
    }

    private void validateOldId(EstimationRequestOldDto dto) {
        if (dto.getOldId() == null) {
            throw new IllegalArgumentException("Validation failed for: field: oldId, rejected value: null");
        }
    }
}
