package com.wastemanagement.backend.services;

import com.wastemanagement.backend.dto.ApiResponse;
import com.wastemanagement.backend.dto.LoginRequestDto;
import com.wastemanagement.backend.dto.LoginResponseDto;
import com.wastemanagement.backend.dto.SignUpResponseDto;
import com.wastemanagement.backend.dto.SignupRequestDto;
import com.wastemanagement.backend.entities.District;
import com.wastemanagement.backend.entities.Role;
import com.wastemanagement.backend.entities.User;
import com.wastemanagement.backend.exceptions.ConflictException;
import com.wastemanagement.backend.exceptions.InternalServerError;
import com.wastemanagement.backend.exceptions.NotFoundException;
import com.wastemanagement.backend.repositories.DistrictRepository;
import com.wastemanagement.backend.repositories.UserRepository;
import com.wastemanagement.backend.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class  AuthService {

        public String generateOTP() {
            return String.valueOf((int)(Math.random() * 900000) + 100000);
        }
        private final UserRepository userRepository;
        private final DistrictRepository districtRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private  final JWTUtil jwtUtil;
        private  final  EmailService emailService;


        @Transactional
        public ApiResponse<SignUpResponseDto> signUp(SignupRequestDto signupRequestDto) {

            if (userRepository.existsByEmail(signupRequestDto.getEmail())) {
                throw new ConflictException("Email already exists");
            }

            District district = districtRepository.findByName(signupRequestDto.getDistrict().trim().toUpperCase())
                    .orElseGet(() ->
                            districtRepository.save(
                                    District.builder()
                                            .name(signupRequestDto.getDistrict().toUpperCase().trim())
                                            .build()
                            )
                    );

            User user = User.builder()
                    .username(signupRequestDto.getUsername())
                    .email(signupRequestDto.getEmail())
                    .district(district)
                    .role(Role.USER)
                    .password(passwordEncoder.encode(signupRequestDto.getPassword()))
                    .build();

            userRepository.save(user);

            SignUpResponseDto responseDto = SignUpResponseDto.builder()
                    .email(user.getEmail())
                    .district(user.getDistrict().getName())
                    .id(user.getId()).role(Role.USER).build();

            ApiResponse<SignUpResponseDto> apiResponse = new ApiResponse<>();
            apiResponse.setData(responseDto);
            apiResponse.setMessage("User registered successfully");
            apiResponse.setStatus(HttpStatus.CREATED);
            apiResponse.setTimestamp(LocalDateTime.now());
            apiResponse.setSuccess(true);
            return apiResponse;
        }


        public ApiResponse<LoginResponseDto> login(LoginRequestDto loginRequestDto) {

            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
                );


            }catch (Exception e) {
                throw new InternalServerError("Invalid email or password");
            }

            User user = userRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> new InternalServerError("Internal server error"));

            String token = jwtUtil.generateToken(user);
            LoginResponseDto loginResponseDto = new LoginResponseDto();
            loginRequestDto.setEmail(user.getEmail());
            loginResponseDto.setToken(token);
            loginResponseDto.setUsername(user.getUsername());
            loginResponseDto.setRole(user.getRole());

            ApiResponse<LoginResponseDto> apiResponse = new ApiResponse<>();
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Login successful");
            apiResponse.setStatus(HttpStatus.OK);
            apiResponse.setTimestamp(LocalDateTime.now());
            apiResponse.setData(loginResponseDto);
            return apiResponse;

        }

    @Transactional
    public ApiResponse<String> forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        String otp = generateOTP();

        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);
        emailService.sendOtp(user.getEmail(), user.getUsername(), otp);


        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("OTP sent to email");
        response.setStatus(HttpStatus.OK);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    @Transactional
    public ApiResponse<String> resetPassword(String email, String otp, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!otp.equals(user.getResetOtp())) {
            throw new InternalServerError("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new InternalServerError("OTP expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        user.setResetOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Password reset successful");
        response.setStatus(HttpStatus.OK);
        response.setTimestamp(LocalDateTime.now());

        return response;
    }
}
