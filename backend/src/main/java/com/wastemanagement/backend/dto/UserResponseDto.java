package com.wastemanagement.backend.dto;


import com.wastemanagement.backend.entities.Role;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class UserResponseDto {

    private Long id;


    private String username;


    private String email;

    private String district;

    private Role role;

}
