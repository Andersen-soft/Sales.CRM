package com.andersenlab.crm.dbtools.dto.rmreport;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MessageDto {
    private String name;
    private List<RequestDto> requests;
}
