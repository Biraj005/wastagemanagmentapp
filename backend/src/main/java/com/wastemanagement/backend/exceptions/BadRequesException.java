package com.wastemanagement.backend.exceptions;

public class BadRequesException extends RuntimeException {
    public BadRequesException(String message) {
        super(message);
    }
}
