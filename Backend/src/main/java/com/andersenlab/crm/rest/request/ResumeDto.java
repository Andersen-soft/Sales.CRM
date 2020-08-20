package com.andersenlab.crm.rest.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
public class ResumeDto {
    @NotBlank
    private String fio;
    @NotBlank
    private String status;
    @NonNull
    private Long responsibleHrId;
    @NonNull
    @JsonProperty("comment")
    private String hrComment;
    private Boolean isUrgent;
}
