package com.wastemanagement.backend.services;

import com.wastemanagement.backend.dto.ApiResponse;
import com.wastemanagement.backend.dto.ComplaintRequestDto;
import com.wastemanagement.backend.dto.ComplaintResponseDto;
import com.wastemanagement.backend.entities.*;
import com.wastemanagement.backend.exceptions.BadRequesException;
import com.wastemanagement.backend.exceptions.InternalServerError;
import com.wastemanagement.backend.exceptions.UnauthorizedException;
import com.wastemanagement.backend.repositories.ComplaintRepository;
import com.wastemanagement.backend.repositories.DistrictRepository;
import com.wastemanagement.backend.repositories.UserRepository;
import com.wastemanagement.backend.util.JWTUtil;
import com.wastemanagement.backend.util.StatusConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private  final ComplaintRepository complaintRepository;
    private  final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final DistrictRepository districtRepository;
    private  final CloudnaryService cloudnaryService;
    private  final StatusConverter statusConverter;

    private ComplaintResponseDto mapToDto(Complaint complaint) {
        ComplaintResponseDto dto = new ComplaintResponseDto();
        dto.setId(complaint.getId());
        dto.setDescription(complaint.getDescription());
        dto.setImageUrl(complaint.getImageUrl());
        dto.setLatitude(complaint.getLatitude());
        dto.setLongitude(complaint.getLongitude());
        dto.setStatus(complaint.getStatus());
        dto.setUser_id(complaint.getUser().getId());
        dto.setDistrictName(complaint.getDistrict().getName());
        dto.setComplaintDate(complaint.getCreatedAt());
        return dto;
    }

    public ApiResponse<List<ComplaintResponseDto>> getAllComplaint(String token, int page, int size, String status) {

        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        Long userId = jwtUtil.extractUserId(token.substring(7));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InternalServerError("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Complaint> complaintsPage;

        if (status == null) {

            if (user.getRole() == Role.ADMIN) {
                complaintsPage = complaintRepository.findAll(pageable);
            } else {
                complaintsPage = complaintRepository.findByDistrictId(
                        user.getDistrict().getId(), pageable
                );
            }

        } else {



            if (user.getRole() == Role.ADMIN) {
                complaintsPage = complaintRepository.findByStatus(statusConverter.convert(status), pageable);
            } else {
                complaintsPage = complaintRepository.findByDistrictIdAndStatus(
                        user.getDistrict().getId(), statusConverter.convert(status), pageable
                );
            }
        }

        List<ComplaintResponseDto> dtos = complaintsPage.getContent()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new ApiResponse<>(
                HttpStatus.OK,
                LocalDateTime.now(),
                true,
                "ok",
                dtos
        );
    }
    public ApiResponse<Complaint> createComplaint(String token, MultipartFile file, ComplaintRequestDto complaint) {

        if(token==null || !token.startsWith("Bearer ")){
            throw new InternalServerError("Internal Server Error");
        }
        if(file==null ){
            throw  new BadRequesException("Image file is required");
        }

        Long userId = jwtUtil.extractUserId(token.substring(7));
        String districtName = complaint.getDistrict().trim().toUpperCase();
        District district = districtRepository.findByName(districtName)
                .orElseGet(()->
                        districtRepository.save(
                                District.builder().name(districtName).build()
                        )
                        );

        String url = cloudnaryService.upload(file).get("secure_url").toString();
        if(url==null || url.isEmpty()){
            throw  new InternalServerError("Internal Server Error");
        }

        Complaint complaint1 = Complaint.builder()
                .district(district)
                .user(userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found")))
                .description(complaint.getDescription())
                .imageUrl(url)
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .status(Status.PENDING)
                .build();
        complaintRepository.save(complaint1);

        return new ApiResponse<>(
                HttpStatus.CREATED,
                LocalDateTime.now(),
                true,
                "ok",
                complaint1
        );

    }

    public ApiResponse<?> deleteById(Long id, String token) {
        if(token==null || !token.startsWith("Bearer ")){
            throw new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Complaint not found"));
        if(!complaint.getUser().getId().equals(userId)){
            throw  new UnauthorizedException("You are not allowed to access this resource");
        }

        complaintRepository.deleteById(id);
        ApiResponse<?> response = new ApiResponse<>();
        response.setStatus(HttpStatus.OK);
        response.setMessage("success");
        response.setSuccess(true);
        return  response;
    }

    public ApiResponse<Complaint> getComplaintById(Long id, String token) {

        if(token==null || !token.startsWith("Bearer ")){
            throw new InternalServerError("Internal Server Error");
        }
        Long userId = jwtUtil.extractUserId(token.substring(7));
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Complaint not found"));
        if(!complaint.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to access this resource");
        }

        return new ApiResponse<>(
                HttpStatus.OK,
                LocalDateTime.now(),
                true,
                "ok",
                complaint
        );
    }
}
