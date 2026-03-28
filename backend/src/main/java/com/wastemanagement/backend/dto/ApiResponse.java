package com.wastemanagement.backend.dto;


import lombok.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ApiResponse<T> {
    private HttpStatus status;
    private LocalDateTime timestamp;
    private  boolean success;
    private String message;
    private T data;
}
