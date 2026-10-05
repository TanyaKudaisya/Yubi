package com.tanya.yubi_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class) //for 404
    public ResponseEntity<Map<String, String>> handleResourceNotFound(
            ResourceNotFoundException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class) //for 400
    public ResponseEntity<Map<String, String>> handleBadRequest(
            BadRequestException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
    @ExceptionHandler(ConflictException.class) //for 409
    public ResponseEntity<Map<String, String>> handleConflict(
            ConflictException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }
    @ExceptionHandler(UnauthorizedException.class) //for 401
    public ResponseEntity<Map<String, String>> handleUnauthorized(
            UnauthorizedException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class) //for 400
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", message));
    }
}