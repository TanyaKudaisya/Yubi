package com.tanya.yubi_backend.repository;

import com.tanya.yubi_backend.dto.SidebarUserProjection;
import com.tanya.yubi_backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m
            WHERE
                (m.sender.id = :user1 AND m.receiver.id = :user2)
                OR
                (m.sender.id = :user2 AND m.receiver.id = :user1)
            ORDER BY m.createdAt ASC
            """)
    List<Message> findConversation(
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );
    @Query(value = """
    SELECT
        u.id AS id,
        u.name AS name,
        u.email AS email,
        u.profile_pic AS profilePic,
        MAX(m.created_at) AS lastMessageAt
    FROM users u
    LEFT JOIN messages m
        ON (m.sender_id = u.id AND m.receiver_id = :currentUserId)
        OR (m.sender_id = :currentUserId AND m.receiver_id = u.id)
    WHERE u.id <> :currentUserId
    GROUP BY u.id, u.name, u.email, u.profile_pic
    ORDER BY MAX(m.created_at) DESC NULLS LAST, u.name ASC
    """, nativeQuery = true)
    List<SidebarUserProjection> findSidebarUsers(
            @Param("currentUserId") Long currentUserId
    );

    @Query("""
    SELECT m FROM Message m
    WHERE m.receiver.id = :userId
      AND m.read = false
    ORDER BY m.createdAt ASC
""")
    List<Message> findUnreadMessages(@Param("userId") Long userId);

    @Modifying
    @Query("""
    UPDATE Message m
    SET m.read = true
    WHERE m.sender.id = :senderId
      AND m.receiver.id = :receiverId
      AND m.read = false
""")
    void markMessagesAsRead(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId
    );
}