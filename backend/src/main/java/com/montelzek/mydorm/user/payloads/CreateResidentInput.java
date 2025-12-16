package com.montelzek.mydorm.user.payloads;

public record CreateResidentInput(
    String firstName,
    String lastName,
    String email,
    String phone,
    String password,
    String roomId
) {}
