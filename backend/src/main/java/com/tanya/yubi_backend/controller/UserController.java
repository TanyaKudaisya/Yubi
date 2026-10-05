package com.tanya.yubi_backend.controller;

import com.tanya.yubi_backend.dto.*;
import com.tanya.yubi_backend.model.User;
import com.tanya.yubi_backend.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.tanya.yubi_backend.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import com.tanya.yubi_backend.service.PresenceService;
import java.util.Set;
import jakarta.validation.Valid;
import com.tanya.yubi_backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final PresenceService presenceService;

    public UserController(
            UserService userService,
            CloudinaryService cloudinaryService,
            PresenceService presenceService
    ) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.presenceService = presenceService;
    }

    @PostMapping
    public AuthResponse signup(
            @Valid @RequestBody SignupRequest request
    ) {
        return userService.createUser(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return userService.login(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication
    ) {
        return userService
                .getCurrentUser(
                        authentication.getName()
                );
    }

    @GetMapping
    public List<SidebarUserResponse> getUsersForSidebar(
            Authentication authentication
    ) {
        return userService.getUsersForSidebar(
                authentication.getName()
        );
    }
    @GetMapping("/online")
    public Set<String> getOnlineUsers() {
        return presenceService.getOnlineUsers();
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        return userService.updateProfile(
                authentication.getName(),
                request
        );
    }

    @PostMapping("/profile-picture")
    public UserResponse uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        if (file.isEmpty()) {
            throw new BadRequestException(
                    "Profile picture is required"
            );
        }

        String imageUrl = cloudinaryService.uploadImage(file);

        return userService.updateProfilePicture(
                authentication.getName(),
                imageUrl
        );
    }
}