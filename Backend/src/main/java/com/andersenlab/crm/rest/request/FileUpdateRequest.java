package com.andersenlab.crm.rest.request;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Represents request for updating file
 *
 * @author Yevhenii Muzyka on 07.08.2018
 */
@Data
public class FileUpdateRequest {
    private String name;
    private LocalDateTime creationDate;
    private Long saleObjectId;
    private Long saleRequestId;

}
