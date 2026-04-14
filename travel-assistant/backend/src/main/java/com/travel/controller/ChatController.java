package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.dto.ChatRequest;
import com.travel.dto.ChatResponse;
import com.travel.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> send(@RequestBody ChatRequest request, Principal principal) {
        ChatResponse response = chatService.handle(request, principal);
        return ResponseEntity.ok(ApiResponse.ok("Chat response", response));
    }
}
