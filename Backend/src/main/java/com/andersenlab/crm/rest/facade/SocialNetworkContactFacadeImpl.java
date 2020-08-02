package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.converter.SocialNetworkContactConverter;
import com.andersenlab.crm.converter.SourceConverter;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.QSource;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.response.SourceDto;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.SocialNetworkContactService;
import com.andersenlab.crm.services.SourceService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SocialNetworkContactFacadeImpl implements SocialNetworkContactFacade {

    private final SocialNetworkContactService networkContactService;
    private final EmployeeService employeeService;
    private final SourceService sourceService;
    private final ConversionService conversionService;

    @Override
    public DtoResponse<SocialNetworkContactDto> create(SocialNetworkContactDto dto) {
        validateSocialNetworkContactDto(dto);
        SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> converter = new SocialNetworkContactConverter();
        SocialNetworkContact contact = converter.convertFromDto(dto);
        SocialNetworkContactDto response = converter.convertFromEntity(networkContactService.create(contact));
        return new DtoResponse<>(response.getId(), response);
    }

    @Override
    public SocialNetworkContactDto getById(Long id) {
        SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> converter = new SocialNetworkContactConverter();
        return converter.convertFromEntity(networkContactService.getById(id));
    }

    @Override
    public Page<SocialNetworkContactDto> getAll(Predicate predicate, Pageable pageable) {
        SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> converter = new SocialNetworkContactConverter();
        Page<SocialNetworkContact> findAll = networkContactService.findAll(predicate, pageable);
        List<SocialNetworkContactDto> response = converter.createFromEntities(findAll.getContent());
        return new PageImpl<>(response, pageable, findAll.getTotalElements());
    }

    @Override
    public Page<SocialNetworkContactDto> getAll(Predicate predicate, Pageable pageable, Locale locale) {
        Page<SocialNetworkContact> findAll = networkContactService.findAll(predicate, pageable);
        return conversionService.convertToPageWithLocale(pageable, findAll, SocialNetworkContactDto.class, locale);
    }

    @Override
    public void delete(Long id) {
        validateSocialNetworkContactId(id);
        networkContactService.delete(id);
    }

    @Override
    public SocialNetworkContactDto update(Long id, SocialNetworkContactDto dto) {
        if (!id.equals(dto.getId())) {
            throw new IllegalArgumentException("Can't match answer dto. Id:" + id + ", answer id:" + dto.getId());
        }
        validateSocialNetworkContactId(dto.getId());
        validateSocialNetworkContactDto(dto);
        SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> converter = new SocialNetworkContactConverter();
        SocialNetworkContact source = converter.convertFromDto(dto);
        SocialNetworkContact persisted = networkContactService.getById(dto.getId());
        source.setCreateDate(persisted.getCreateDate());
        return converter.convertFromEntity(networkContactService.update(source));
    }

    @Override
    public List<SourceDto> getSocialNetworkSources() {
        Predicate predicate = QSource.source.type.eq(Source.Type.SOCIAL_NETWORK);
        List<Source> sources = sourceService.findAll(predicate);
        SimpleConverter<SourceDto, Source> converter = new SourceConverter();
        return converter.createFromEntities(sources);
    }

    private void validateSocialNetworkContactId(Long id) {
        if (!networkContactService.exist(id)) {
            throw new EntityNotFoundException("Social network contact not found: " + id);
        }
    }

    private void validateSocialNetworkContactDto(SocialNetworkContactDto dto) {
        validateSales(dto.getSales());
        validateSalesAssistant(dto.getSalesAssistant());
        validateSource(dto.getSource());
    }

    private void validateSales(@NotNull EmployeeDto dto) {
        if (isNullId(dto.getId())) {
            throw new IllegalArgumentException("Sales must have id.");
        }
        employeeService.validateByIdAndRole(dto.getId(), RoleEnum.ROLE_SALES);
    }

    private void validateSalesAssistant(@NotNull EmployeeDto dto) {
        if (isNullId(dto.getId())) {
            throw new IllegalArgumentException("Sales assistant must have id.");
        }
        employeeService.validateByIdAndRole(dto.getId(), RoleEnum.ROLE_NETWORK_COORDINATOR);
    }

    private void validateSource(@NotNull SourceDto dto) {
        if (isNullId(dto.getId())) {
            throw new IllegalArgumentException("Resource must have id.");
        }
        sourceService.validateSourceType(dto.getId(), Source.Type.SOCIAL_NETWORK);
    }

    private boolean isNullId(Long id) {
        return id == null;
    }

}
