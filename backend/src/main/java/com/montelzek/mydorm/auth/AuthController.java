package com.montelzek.mydorm.auth;

import com.montelzek.mydorm.auth.payload.JwtResponse;
import com.montelzek.mydorm.auth.payload.LoginInput;
import com.montelzek.mydorm.auth.payload.MessageResponse;
import com.montelzek.mydorm.auth.payload.RegisterInput;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @MutationMapping
    public JwtResponse loginUser(@Argument @Valid LoginInput loginInput) {
        return authService.login(loginInput);
    }

    @MutationMapping
    public MessageResponse registerUser(@Argument @Valid RegisterInput registerInput) {
        authService.register(registerInput);
        return new MessageResponse("User registered successfully!");
    }
}
