package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.converter.SocialNetworkUserConverter;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import com.andersenlab.crm.services.SocialNetworkUserService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SocialNetworkUserFacadeImpl implements SocialNetworkUserFacade {

    private final SocialNetworkUserService networkUserService;
    private final ConversionService conversionService;

    @Override
    public DtoResponse<SocialNetworkUserDto> create(SocialNetworkUserDto dto) {
        SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> converter = new SocialNetworkUserConverter();
        SocialNetworkUser networkUser = converter.convertFromDto(dto);
        SocialNetworkUserDto response = converter.convertFromEntity(networkUserService.createOrUpdate(networkUser));
        return new DtoResponse<>(response.getId(), response);
    }


    @Override
    public SocialNetworkUserDto getById(Long id) {
        SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> converter = new SocialNetworkUserConverter();
        return converter.convertFromEntity(networkUserService.findById(id));
    }

    @Override
    public Page<SocialNetworkUserDto> getAll(Predicate predicate, Pageable pageable) {
        SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> converter = new SocialNetworkUserConverter();
        Page<SocialNetworkUser> findAll = networkUserService.findAll(predicate, pageable);
        List<SocialNetworkUserDto> response = converter.createFromEntities(findAll.getContent());
        return new PageImpl<>(response, pageable, findAll.getTotalElements());
    }

    @Override
    public Page<String> getAllBySaleReport(Predicate predicate, Pageable pageable) {
        List<String> users = networkUserService.findAllBySaleReport(predicate, pageable);
        return new PageImpl<>(users, pageable, users.size());
    }

    @Override
    public void delete(Long id) {
        networkUserService.delete(id);
    }

    @Override
    public SocialNetworkUserDto update(Long id, SocialNetworkUserDto dto) {
        if (!id.equals(dto.getId())) {
            throw new IllegalArgumentException("Can't match answer dto. Id:" + id + ", answer id:" + dto.getId());
        }
        validateSocialUserContactId(dto.getId());
        SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> converter = new SocialNetworkUserConverter();
        SocialNetworkUser source = converter.convertFromDto(dto);
        return converter.convertFromEntity(networkUserService.createOrUpdate(source));
    }

    private void validateSocialUserContactId(Long id) {
        if (!networkUserService.exist(id)) {
            throw new EntityNotFoundException("Social user not found: " + id);
        }
    }
}
