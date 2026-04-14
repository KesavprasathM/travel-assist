package com.travel.dto;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ChatResponse {
    private String reply;
    private Map<String, Object> context;
    private List<String> quickReplies;
    private List<Map<String, Object>> transportOptions;
    private List<String> hotelOptions;
    private boolean requiresLogin;
}
