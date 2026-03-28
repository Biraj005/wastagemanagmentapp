package com.wastemanagement.backend.exceptions;


import lombok.*;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ApiResponse<M> {
    private HttpStatus status;
    private LocalDateTime timestamp;
    private  boolean success;
    private String message;
}
