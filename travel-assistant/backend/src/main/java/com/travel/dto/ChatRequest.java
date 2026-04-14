package com.travel.dto;
import lombok.Data;
import java.util.Map;

@Data
public class ChatRequest {
    private String message;
    private Map<String, Object> context;
}
