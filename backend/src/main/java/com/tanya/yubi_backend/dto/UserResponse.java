package com.tanya.yubi_backend.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String profilePic;
    private LocalDateTime createdAt;

    public UserResponse(
            Long id,
            String name,
            String email,
            String profilePic,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePic = profilePic;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getProfilePic() {
        return profilePic;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}