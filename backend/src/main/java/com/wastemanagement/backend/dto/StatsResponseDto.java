package com.wastemanagement.backend.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StatsResponseDto {
    private  long totalComplaints;
    private  long totalComplaintsAdmin;
    private  long totalPendingComplaints;


}
