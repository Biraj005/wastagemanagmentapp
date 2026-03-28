package com.wastemanagement.backend.controllers;

import com.wastemanagement.backend.dto.*;
import com.wastemanagement.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    ResponseEntity<ApiResponse<SignUpResponseDto>> signup(@Valid @RequestBody SignupRequestDto  signupRequestDto) {
        System.out.println("Signup Request: " + signupRequestDto.toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(signupRequestDto));
    }
    @PostMapping("/login")
    ResponseEntity<ApiResponse<LoginResponseDto>>login(@Valid @RequestBody LoginRequestDto loginResponseDto) {
        return ResponseEntity.ok(authService.login(loginResponseDto));
    }
    @PostMapping("/forgot-password")
    public ApiResponse<String> forgot(@Valid @RequestBody ForgotPasswordRequestDto request) {
        return authService.forgotPassword(request.getEmail());
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> reset(@Valid @RequestBody ResetPasswordRequestDto request) {
        return authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
    }
}
