package com.tanya.yubi_backend.service;

import com.tanya.yubi_backend.dto.*;
import com.tanya.yubi_backend.exception.BadRequestException;
import com.tanya.yubi_backend.exception.ConflictException;
import com.tanya.yubi_backend.exception.ResourceNotFoundException;
import com.tanya.yubi_backend.exception.UnauthorizedException;
import com.tanya.yubi_backend.model.User;
import com.tanya.yubi_backend.repository.MessageRepository;
import com.tanya.yubi_backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            MessageRepository messageRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse createUser(SignupRequest request) {

        String email = request.getEmail().toLowerCase();

        if (!email.endsWith("@glbitm.ac.in")) {
            throw new BadRequestException(
                    "Only GLBITM email addresses are allowed"
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        User savedUser = userRepository.save(user);

        String token =
                jwtService.generateToken(
                        savedUser.getEmail()
                );

        return new AuthResponse(
                token,
                toResponse(savedUser)
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request
                                        .getEmail()
                                        .toLowerCase()
                        )
                        .orElseThrow(
                                () -> new UnauthorizedException(
                                        "Invalid email or password"
                                )
                        );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new UnauthorizedException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                token,
                toResponse(user)
        );
    }

    public List<SidebarUserResponse> getUsersForSidebar(String email) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return messageRepository.findSidebarUsers(currentUser.getId())
                .stream()
                .map(user -> new SidebarUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getProfilePic(),
                        user.getLastMessageAt()
                ))
                .toList();
    }

    public UserResponse getCurrentUser(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return toResponse(user);
    }

    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        user.setName(request.getName());

        return toResponse(
                userRepository.save(user)
        );
    }

    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePic(),
                user.getCreatedAt()
        );
    }

    public UserResponse updateProfilePicture(
            String email,
            String imageUrl
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        user.setProfilePic(imageUrl);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }
}