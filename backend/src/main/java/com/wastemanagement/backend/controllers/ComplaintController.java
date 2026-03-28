package com.wastemanagement.backend.controllers;

import com.wastemanagement.backend.dto.ApiResponse;
import com.wastemanagement.backend.dto.ComplaintRequestDto;
import com.wastemanagement.backend.dto.ComplaintResponseDto;
import com.wastemanagement.backend.entities.Complaint;
import com.wastemanagement.backend.entities.Status;
import com.wastemanagement.backend.services.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/complaint")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getAllComplaint(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "status", required = false) String status){
       return ResponseEntity.ok(complaintService.getAllComplaint(token,page,size,status));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Complaint>> createComplaint(
            @RequestPart("data") String dataJson,
            @RequestPart("image") MultipartFile image,
            @RequestHeader("Authorization") String token
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ComplaintRequestDto request = mapper.readValue(dataJson, ComplaintRequestDto.class);
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Complaint>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .timestamp(LocalDateTime.now())
                            .success(false)
                            .message("Description is required")
                            .data(null)
                            .build());
        }

        if (request.getLatitude() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Complaint>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .timestamp(LocalDateTime.now())
                            .success(false)
                            .message("Latitude is required")
                            .data(null)
                            .build());
        }

        if (request.getLongitude() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Complaint>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .timestamp(LocalDateTime.now())
                            .success(false)
                            .message("Longitude is required")
                            .data(null)
                            .build());
        }

        if (request.getDistrict() == null || request.getDistrict().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Complaint>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .timestamp(LocalDateTime.now())
                            .success(false)
                            .message("District is required")
                            .data(null)
                            .build());
        }

        return ResponseEntity.ok(complaintService.createComplaint(token, image, request));


    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Complaint>> getComplaintById(@PathVariable Long id,
                                                                   @RequestHeader("Authorization") String token) {

        return ResponseEntity.ok(complaintService.getComplaintById(id,token));
    }
    @DeleteMapping("/{id}")
    public  ResponseEntity<ApiResponse<?>> deleteById(@PathVariable("id") Long id,
                                    @RequestHeader("Authorization") String token   ) {
        return ResponseEntity.ok(complaintService.deleteById(id,token));
    }

}
