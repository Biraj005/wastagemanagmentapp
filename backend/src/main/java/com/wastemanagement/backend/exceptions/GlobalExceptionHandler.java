package com.wastemanagement.backend.exceptions;

import com.wastemanagement.backend.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException; // ✅ fixed import
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private <T> ResponseEntity<ApiResponse<T>> buildApiResponse(String message, HttpStatus status, T data) {
        ApiResponse<T> apiResponse = new ApiResponse<>();
        apiResponse.setMessage(message);
        apiResponse.setStatus(status);
        apiResponse.setTimestamp(LocalDateTime.now());
        apiResponse.setSuccess(false);
        apiResponse.setData(data);
        return ResponseEntity.status(status).body(apiResponse);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestException(BadRequestException e) {
        return buildApiResponse(e.getMessage(), HttpStatus.BAD_REQUEST, null);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFoundException(NotFoundException e) {
        return buildApiResponse(e.getMessage(), HttpStatus.NOT_FOUND, null);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflictException(ConflictException e) {
        return buildApiResponse(e.getMessage(), HttpStatus.CONFLICT, null);
    }

    @ExceptionHandler(InternalServerError.class)
    public ResponseEntity<ApiResponse<Void>> handleInternalServerError(InternalServerError e) {
        return buildApiResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
    }

    @ExceptionHandler(AuthenticationException.class) // ✅ now catches Spring Security's exception
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request) {
        return buildApiResponse(
                "Authentication required to access this resource",
                HttpStatus.UNAUTHORIZED,
                null
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {
        return buildApiResponse(
                "You are not allowed to access this resource",
                HttpStatus.FORBIDDEN,
                null
        );
    }
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(         UnauthorizedException e) {
        return buildApiResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return buildApiResponse("Validation failed", HttpStatus.BAD_REQUEST, errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        return buildApiResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, null);
    }
}