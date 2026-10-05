package com.tanya.yubi_backend.controller;
import com.tanya.yubi_backend.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import com.tanya.yubi_backend.dto.MessageResponse;
import com.tanya.yubi_backend.dto.SendMessageRequest;
import com.tanya.yubi_backend.model.Message;
import com.tanya.yubi_backend.service.MessageService;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;
    private final CloudinaryService cloudinaryService;
    public MessageController(
            MessageService messageService,
            SimpMessagingTemplate messagingTemplate,
            CloudinaryService cloudinaryService
    ) {
        this.messageService =
                messageService;

        this.messagingTemplate =
                messagingTemplate;
        this.cloudinaryService =
                cloudinaryService;
    }

    @PostMapping
    public MessageResponse sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {

        Message message =
                messageService.createMessage(
                        authentication.getName(),
                        request
                );

        MessageResponse response =
                messageService.toResponse(message);

        String destination =
                "/topic/messages/" + message.getReceiver().getId();

        System.out.println(
                "Sending WebSocket message to: " + destination
        );

        messagingTemplate.convertAndSend(
                destination,
                response
        );

        return response;
    }

    @GetMapping("/{userId}")
    public List<MessageResponse> getConversation(
            @PathVariable Long userId,
            Authentication authentication
    ) {

        return messageService
                .getConversation(
                        authentication.getName(),
                        userId
                );
    }
    @PostMapping("/image")
    public MessageResponse sendImageMessage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("receiverId") Long receiverId,
            @RequestParam(value = "text", required = false) String text,
            Authentication authentication
    ) throws IOException {

        String imageUrl = cloudinaryService.uploadImage(file);

        SendMessageRequest request = new SendMessageRequest();
        request.setReceiverId(receiverId);
        request.setText(text);
        request.setImage(imageUrl);

        Message message = messageService.createMessage(
                authentication.getName(),
                request
        );

        MessageResponse response = messageService.toResponse(message);

        String destination = "/topic/messages/" + message.getReceiver().getId();

        messagingTemplate.convertAndSend(destination, response);

        return response;
    }
    @GetMapping("/unread")
    public Map<Long, Long> getUnreadCounts(
            Authentication authentication
    ) {
        return messageService.getUnreadCounts(
                authentication.getName()
        );
    }

    @PutMapping("/{userId}/read")
    public void markMessagesAsRead(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        Long readerId = messageService.markMessagesAsRead(
                authentication.getName(),
                userId
        );

        String destination = "/topic/messages/read/" + userId;

        messagingTemplate.convertAndSend(
                destination,
                (Object) Map.of("userId", readerId)
        );
    }
}