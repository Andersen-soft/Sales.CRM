package com.andersenlab.crm.rest.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Contains file information
 *
 * @author Yevhenii Muzyka on 07.08.2018
 */
@Data
public class FileResponse {
    private Long id;
    private String name;
    private LocalDateTime creationDate;
    private Long saleObjectId;
    private Long saleRequestId;
}
