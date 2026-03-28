package com.wastemanagement.backend.controllers;

import com.wastemanagement.backend.dto.*;
import com.wastemanagement.backend.entities.Complaint;
import com.wastemanagement.backend.entities.User;
import com.wastemanagement.backend.services.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/add/district-admin")
    public ResponseEntity<ApiResponse<SignUpResponseDto>> addDistrictAdmin(
            @Valid @RequestBody SignupRequestDto signupRequestDto

    ){
        ApiResponse<SignUpResponseDto> response = adminService.addDistrictAdmin(signupRequestDto);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/delete/district-admin/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDistrictAdmin(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String token
    ){
        ApiResponse<String> response = adminService.deleteDistrictAdmin(id, token);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/complaint")
    public  ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints(
            @RequestHeader("Authorization") String token
    ){
        return ResponseEntity.ok(adminService.getAllComplaints(token));

    }

    @PutMapping("/complaint/{id}")
    public  ResponseEntity<ApiResponse<Complaint>> updateStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdatComplaintStatusDto updatComplaintStatusDto,
            @RequestHeader("Authorization") String token
            ){

        return ResponseEntity.status(HttpStatus.OK).body(adminService.updateStatus(id,updatComplaintStatusDto,token));
    }
    @GetMapping("/super-admin/admins")
    public  ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllSuperAdmins(
            @RequestParam(value = "page",defaultValue = "0") int page,
            @RequestParam(value = "size",defaultValue = "5") int size
    ){
        return ResponseEntity.ok(adminService.getAllSuperAdmins(page,size));
    }
    @GetMapping("/stats")
    public  ResponseEntity<ApiResponse<StatsResponseDto>> getAllStats(
            @RequestHeader("Authorization") String token){

        return  ResponseEntity.ok(adminService.getAllStats(token));

    }
}