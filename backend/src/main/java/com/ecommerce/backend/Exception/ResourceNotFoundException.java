package com.ecommerce.backend.exception;


public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String entityType, String field, Object value) {
        super(String.format("%s not found with %s: %s", entityType, field, value));
    }
}