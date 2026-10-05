package com.tanya.yubi_backend.dto;

import jakarta.validation.constraints.NotNull;

public class SendMessageRequest {

    @NotNull(message = "Receiver is required")
    private Long receiverId;

    private String text;

    private String image;

    public SendMessageRequest() {
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}