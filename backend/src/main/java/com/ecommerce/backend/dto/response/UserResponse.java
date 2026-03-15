package com.ecommerce.backend.dto.response;



import java.time.LocalDateTime;

import com.ecommerce.backend.entity.enums.UserRole;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
