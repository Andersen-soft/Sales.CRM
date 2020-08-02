package com.andersenlab.crm.rest.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@RequiredArgsConstructor
public class SourceStatisticResponse {
    final Map<String, Object> statistics;
    final List<Long> withoutMainContact;
}
