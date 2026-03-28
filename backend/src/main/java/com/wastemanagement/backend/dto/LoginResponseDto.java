package com.wastemanagement.backend.dto;

import com.wastemanagement.backend.entities.Role;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class LoginResponseDto {
    private String token;
    private String username;
    private Role role;
}
