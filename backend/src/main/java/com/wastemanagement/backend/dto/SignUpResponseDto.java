package com.wastemanagement.backend.dto;

import com.wastemanagement.backend.entities.Role;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignUpResponseDto {
    private Long id;
    private String name;
    private String email;
    private String district;
    private Role role;
}
