package com.wastemanagement.backend.services;


import com.wastemanagement.backend.config.JwtFilter;
import com.wastemanagement.backend.dto.*;
import com.wastemanagement.backend.entities.*;
import com.wastemanagement.backend.exceptions.BadRequesException;
import com.wastemanagement.backend.exceptions.ConflictException;
import com.wastemanagement.backend.exceptions.InternalServerError;
import com.wastemanagement.backend.exceptions.UnauthorizedException;
import com.wastemanagement.backend.repositories.ComplaintRepository;
import com.wastemanagement.backend.repositories.DistrictRepository;
import com.wastemanagement.backend.repositories.UserRepository;
import com.wastemanagement.backend.util.JWTUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private  final UserRepository userRepository;
    private  final DistrictRepository districtRepository;
    private  final PasswordEncoder passwordEncoder;
    private  final JWTUtil jwtUtil;
    private   final ComplaintRepository complaintRepository;


    public ApiResponse<SignUpResponseDto> addDistrictAdmin(@Valid SignupRequestDto signupRequestDto) {

        Optional<User> user = userRepository.findByEmail(signupRequestDto.getEmail());
        if(user.isPresent()){
            throw  new ConflictException("User already exists");
        }
        District district = districtRepository.findByName(signupRequestDto.getDistrict().trim().toUpperCase())
                .orElseGet(() ->
                        districtRepository.save(
                                District.builder()
                                        .name(signupRequestDto.getDistrict())
                                        .build()
                        )
                );

        User newUser = User.builder().
                                email(signupRequestDto.getEmail()).
                                 district(district).
                                 role(Role.DISTRICT_ADMIN).
                                username(signupRequestDto.getUsername()).
                                password(passwordEncoder.encode(signupRequestDto.getPassword())).
                                build();
        userRepository.save(newUser);

        return new ApiResponse<>(
                HttpStatus.OK,
                LocalDateTime.now(),
                true,
                "Successfully signuped",
                SignUpResponseDto.builder()                        .email(newUser.getEmail())
                        .id(newUser.getId())
                        .email(newUser.getEmail())
                        .district(newUser.getDistrict().getName())
                        .role(Role.DISTRICT_ADMIN)
                        .build()
        );
    }

    public ApiResponse<List<Complaint>> getAllComplaints(String token) {

        if(token == null || !token.startsWith("Bearer ")){
            throw  new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        User user = userRepository.findById(userId).orElseThrow(()->new InternalServerError("User not found"));

        List<Complaint> complaints = complaintRepository.findByDistrictId(user.getDistrict().getId());
        return new ApiResponse<>(
                HttpStatus.OK,
                LocalDateTime.now(),
                true,
                "ok",
                complaints
        );

    }

    public ApiResponse<Complaint> updateStatus(Long id, UpdatComplaintStatusDto updatComplaintStatusDto, String token) {
        if(token == null || !token.startsWith("Bearer ")){
            throw  new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        User user = userRepository.findById(userId).orElseThrow(()->new InternalServerError("User not found"));

        Long districtId = jwtUtil.extractUserId(token.substring(7));

        Complaint complaint = complaintRepository.findById(id).orElseThrow(()->new BadRequesException("Complaint not found"));

        if(!complaint.getDistrict().getId().equals(user.getDistrict().getId()) && user.getRole() != Role.ADMIN){
            throw  new UnauthorizedException("You are not allowed to do the operation");
        }
        complaint.setStatus(updatComplaintStatusDto.getStatus());
        complaintRepository.save(complaint);
        return new ApiResponse<>(
                HttpStatus.OK,
                LocalDateTime.now(),
                true,
                "status updated",
                complaint
        );

    }

    public ApiResponse<List<UserResponseDto>> getAllSuperAdmins(int pagenumber, int size) {

        Pageable pageable = PageRequest.of(pagenumber, size);

        Page<User> page = userRepository.findByRole(Role.DISTRICT_ADMIN, pageable);

        List<User> users = page.getContent();
           ApiResponse<List<UserResponseDto>> apiResponse = new ApiResponse<>();
           apiResponse.setData(users.stream().map(user -> UserResponseDto.builder()
                   .id(user.getId())
                   .email(user.getEmail())
                   .username(user.getUsername())
                   .district(user.getDistrict().getName())
                   .role(user.getRole())
                   .build()).toList());
           apiResponse.setTimestamp(LocalDateTime.now());
           apiResponse.setStatus(HttpStatus.OK);
           apiResponse.setMessage("success");
           apiResponse.setSuccess(true);
           return apiResponse;
        }


    public ApiResponse<String> deleteDistrictAdmin(Long id, String token) {
        if(token == null || !token.startsWith("Bearer ")){
            throw  new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        User user = userRepository.findById(userId).orElseThrow(()->new InternalServerError("User not found"));

        if(user.getRole() != Role.ADMIN){
            throw  new UnauthorizedException("You are not allowed to do the operation");
        }
        User to_delete = userRepository.findById(id).orElseThrow(()->new BadRequesException("User not found"));
        userRepository.delete(to_delete);
        ApiResponse<String> response = new ApiResponse<>();
        response.setStatus(HttpStatus.OK);
        response.setMessage("success");
        response.setSuccess(true);
        return response;
    }

    public ApiResponse<StatsResponseDto> getAllStats(String token) {

        if(token== null || !token.startsWith("Bearer ")){
            throw  new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        System.out.println(userId+"userid");

        User user = userRepository.findById(userId).orElseThrow(()->new InternalServerError("User not found"));
        if (user.getRole().equals(Role.DISTRICT_ADMIN)) {
           long totalComplaints = complaintRepository.countByDistrictId(user.getDistrict().getId());
           long totalpendingComplaints = complaintRepository.countByDistrictIdAndStatus(user.getDistrict().getId(), Status.PENDING);
           long total_admins = userRepository.countByRole(Role.DISTRICT_ADMIN);
            ApiResponse<StatsResponseDto> apiResponse = new ApiResponse<>();
            apiResponse.setData(StatsResponseDto.builder()
                    .totalComplaints(totalComplaints)
                    .totalPendingComplaints(totalpendingComplaints)
                    .totalComplaintsAdmin(total_admins)
                    .build());
            apiResponse.setTimestamp(LocalDateTime.now());
            apiResponse.setStatus(HttpStatus.OK);
            apiResponse.setMessage("success");
            apiResponse.setSuccess(true);
            return apiResponse;
        }

        long totalcomplaints = complaintRepository.count();
        long totalpendingcomplaints = complaintRepository.countByStatus(Status.PENDING);
        long  totalAdminse = userRepository.countByRole(Role.DISTRICT_ADMIN);

        ApiResponse<StatsResponseDto> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("success");
        apiResponse.setSuccess(true);
        apiResponse.setTimestamp(LocalDateTime.now());
        apiResponse.setData(StatsResponseDto.builder()
                .totalComplaints(totalcomplaints)
                .totalPendingComplaints(totalpendingcomplaints)
                .totalComplaintsAdmin(totalAdminse)
                .build());

        return apiResponse;
    }
}

