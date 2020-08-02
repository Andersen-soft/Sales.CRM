package com.andersenlab.crm.convertservice;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class SimpleConverter<T, C> {

    private final Function<T, C> fromDto;
    private final Function<C, T> fromEntity;

    /**
     * @param fromDto    Function that converts given dto entity into the domain entity.
     * @param fromEntity Function that converts given domain entity into the dto entity.
     */
    protected SimpleConverter(final Function<T, C> fromDto, final Function<C, T> fromEntity) {
        this.fromDto = fromDto;
        this.fromEntity = fromEntity;
    }

    /**
     * @param customerDto DTO entity
     * @return The domain representation - the result of the converting function application on dto entity.
     */
    public C convertFromDto(final T customerDto) {
        return fromDto.apply(customerDto);
    }

    /**
     * @param customer domain entity
     * @return The DTO representation - the result of the converting function application on domain entity.
     */
    public T convertFromEntity(final C customer) {
        return fromEntity.apply(customer);
    }

    /**
     * @param dtoCustomers collection of DTO entities
     * @return List of domain representation of provided entities retrieved by
     * mapping each of them with the conversion function
     */
    @SuppressWarnings("unused")
    public final List<C> createFromDtos(final Collection<T> dtoCustomers) {
        return dtoCustomers.stream().map(this::convertFromDto).collect(Collectors.toList());
    }

    /**
     * @param customers collection of domain entities
     * @return List of domain representation of provided entities retrieved by
     * mapping each of them with the conversion function
     */
    public final List<T> createFromEntities(final Collection<C> customers) {
        return customers.stream().map(this::convertFromEntity).collect(Collectors.toList());
    }

}