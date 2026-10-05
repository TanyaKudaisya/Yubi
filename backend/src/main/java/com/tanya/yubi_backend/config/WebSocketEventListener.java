package com.tanya.yubi_backend.config;

import com.tanya.yubi_backend.dto.PresenceUpdate;
import com.tanya.yubi_backend.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(
            PresenceService presenceService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String email = (String)
                accessor.getSessionAttributes().get("email");

        if (email == null) {
            return;
        }

        presenceService.userConnected(email);

        System.out.println("User connected: " + email);
        System.out.println("Online users: " +
                presenceService.getOnlineUsers());

        PresenceUpdate presenceUpdate =
                new PresenceUpdate(email, true);

        messagingTemplate.convertAndSend(
                "/topic/presence",
                presenceUpdate
        );
    }

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String email = (String)
                accessor.getSessionAttributes().get("email");

        if (email == null) {
            return;
        }

        presenceService.userDisconnected(email);

        System.out.println("User disconnected: " + email);
        System.out.println("Online users: " +
                presenceService.getOnlineUsers());

        PresenceUpdate presenceUpdate =
                new PresenceUpdate(email, false);

        messagingTemplate.convertAndSend(
                "/topic/presence",
                presenceUpdate
        );
    }
}