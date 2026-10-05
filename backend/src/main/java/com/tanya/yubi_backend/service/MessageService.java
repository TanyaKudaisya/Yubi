package com.tanya.yubi_backend.service;

import com.tanya.yubi_backend.dto.MessageResponse;
import com.tanya.yubi_backend.dto.SendMessageRequest;
import com.tanya.yubi_backend.exception.ResourceNotFoundException;
import com.tanya.yubi_backend.model.Message;
import com.tanya.yubi_backend.model.User;
import com.tanya.yubi_backend.repository.MessageRepository;

import com.tanya.yubi_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.tanya.yubi_backend.exception.BadRequestException;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    private final CloudinaryService cloudinaryService;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService
    ) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public Message createMessage(
            String email,
            SendMessageRequest request
    ) {

        User sender =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Sender not found"
                                )
                        );

        User receiver =
                userRepository
                        .findById(
                                request.getReceiverId()
                        )
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Receiver not found"
                                )
                        );

        if ((request.getText() == null || request.getText().isBlank())
                && (request.getImage() == null || request.getImage().isBlank())) {

            throw new BadRequestException("Message cannot be empty");
        }

        Message message = new Message();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(request.getText());
        message.setImage(request.getImage());

        return messageRepository.save(message);
    }

    public List<MessageResponse> getConversation(
            String email,
            Long otherUserId
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return messageRepository
                .findConversation(
                        currentUser.getId(),
                        otherUserId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MessageResponse toResponse(
            Message message
    ) {

        return new MessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getReceiver().getId(),
                message.getText(),
                message.getImage(),
                message.isRead(),
                message.getCreatedAt()
        );
    }

    public Map<Long, Long> getUnreadCounts(String email) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return messageRepository
                .findUnreadMessages(currentUser.getId())
                .stream()
                .collect(Collectors.groupingBy(
                        message -> message.getSender().getId(),
                        Collectors.counting()
                ));
    }

    @Transactional
    public Long markMessagesAsRead(String email, Long senderId) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        messageRepository.markMessagesAsRead(
                senderId,
                currentUser.getId()
        );

        return currentUser.getId();
    }
}