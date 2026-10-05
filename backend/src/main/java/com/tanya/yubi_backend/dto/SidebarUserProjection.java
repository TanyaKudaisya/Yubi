package com.tanya.yubi_backend.dto;

import java.time.LocalDateTime;

public interface SidebarUserProjection {

    Long getId();

    String getName();

    String getEmail();
    String getProfilePic();

    LocalDateTime getLastMessageAt();
}