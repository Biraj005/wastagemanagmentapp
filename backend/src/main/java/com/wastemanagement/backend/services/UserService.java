package com.wastemanagement.backend.services;

import com.wastemanagement.backend.dto.ApiResponse;
import com.wastemanagement.backend.dto.UserResponseDto;
import com.wastemanagement.backend.entities.User;
import com.wastemanagement.backend.exceptions.InternalServerError;
import com.wastemanagement.backend.repositories.UserRepository;
import com.wastemanagement.backend.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private  final JWTUtil jwtUtil;
    @GetMapping
    public ApiResponse<UserResponseDto> getUser(@RequestHeader("Authorization") String token) {

        if(token==null || !token.startsWith("Bearer ")){
            throw  new InternalServerError("Internal Server Error");
        }
        String email = jwtUtil.extractEmail(token.substring(7));

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new InternalServerError("Internal Server Error"));

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setUsername(user.getUsername());
        userResponseDto.setId(user.getId());
        userResponseDto.setDistrict(user.getDistrict().getName());
        userResponseDto.setRole(user.getRole());
        ApiResponse<UserResponseDto> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Success");
        apiResponse.setData(userResponseDto);
        apiResponse.setTimestamp(LocalDateTime.now());
        apiResponse.setStatus(org.springframework.http.HttpStatus.OK);
        return apiResponse;
    }
}
