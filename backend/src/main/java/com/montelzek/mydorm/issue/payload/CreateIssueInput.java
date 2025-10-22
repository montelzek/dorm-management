package com.montelzek.mydorm.issue.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateIssueInput(
        @NotBlank
        @Size(max = 200)
        String title,
        
        @NotBlank
        @Size(max = 2000)
        String description,
        
        @NotBlank
        String priority
) {}

