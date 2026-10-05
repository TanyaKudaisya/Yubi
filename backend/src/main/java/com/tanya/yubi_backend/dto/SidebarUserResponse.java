package com.tanya.yubi_backend.dto;

import java.time.LocalDateTime;

public class SidebarUserResponse {

    private Long id;
    private String name;
    private String email;
    private String profilePic;
    private LocalDateTime lastMessageAt;


    public SidebarUserResponse(
            Long id,
            String name,
            String email,
            String profilePic,
            LocalDateTime lastMessageAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePic = profilePic;
        this.lastMessageAt = lastMessageAt;
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

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }
}