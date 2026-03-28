package com.wastemanagement.backend.controllers;

import com.wastemanagement.backend.dto.ApiResponse;
import com.wastemanagement.backend.dto.UserResponseDto;
import com.wastemanagement.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {


    private  final UserService userService;
    @GetMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> getUser(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.getUser(token));
    }
}
