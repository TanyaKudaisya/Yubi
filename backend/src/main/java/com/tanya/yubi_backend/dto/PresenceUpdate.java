package com.tanya.yubi_backend.dto;

public class PresenceUpdate {

    private String email;
    private boolean online;

    public PresenceUpdate() {
    }

    public PresenceUpdate(String email, boolean online) {
        this.email = email;
        this.online = online;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}