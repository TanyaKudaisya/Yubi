package com.tanya.yubi_backend.controller;

import com.tanya.yubi_backend.dto.SendMessageRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public SendMessageRequest sendMessage(SendMessageRequest request) {
        return request;
    }
}