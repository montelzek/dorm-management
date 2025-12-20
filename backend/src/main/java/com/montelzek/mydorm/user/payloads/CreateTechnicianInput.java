package com.montelzek.mydorm.user.payloads;

public record CreateTechnicianInput(
        String firstName,
        String lastName,
        String email,
        String phone,
        String password
) {}
