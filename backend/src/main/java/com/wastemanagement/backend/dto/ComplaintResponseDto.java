package com.wastemanagement.backend.dto;

import com.wastemanagement.backend.entities.Status;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class ComplaintResponseDto {
    private Long id;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Status status;
    private Long  user_id;
    private String districtName;
    private LocalDateTime complaintDate;


}
