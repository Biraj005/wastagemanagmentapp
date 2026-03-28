package com.wastemanagement.backend.dto;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class ForgotPasswordRequestDto {

    @Email
    @NotBlank
    private String email;
}