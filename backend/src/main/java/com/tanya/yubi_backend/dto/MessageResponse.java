package com.tanya.yubi_backend.dto;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private Long senderId;
    private Long receiverId;
    private String text;
    private String image;
    private boolean read;
    private LocalDateTime createdAt;

    public MessageResponse(
            Long id,
            Long senderId,
            Long receiverId,
            String text,
            String image,
            boolean read,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.text = text;
        this.image = image;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getText() {
        return text;
    }

    public String getImage() {
        return image;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}