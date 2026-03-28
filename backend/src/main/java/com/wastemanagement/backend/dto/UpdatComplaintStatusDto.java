package com.wastemanagement.backend.dto;

import com.wastemanagement.backend.entities.Status;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatComplaintStatusDto {

    @NotNull(message = "Status is required")
    private Status status;
}
