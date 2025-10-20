package com.montelzek.mydorm.auth;

import com.montelzek.mydorm.auth.payload.JwtResponse;
import com.montelzek.mydorm.auth.payload.LoginInput;
import com.montelzek.mydorm.auth.payload.RegisterInput;
import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.security.jwt.JwtUtils;
import com.montelzek.mydorm.user.ERole;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public JwtResponse login(LoginInput loginInput) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginInput.email(), loginInput.password())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), userDetails.getFirstName(), roles);
        } catch (BadCredentialsException e) {
            throw new BusinessException(ErrorCodes.INVALID_CREDENTIALS, "Invalid email or password.", "credentials");
        }
    }

    public void register(RegisterInput registerInput) {
        if (userRepository.existsByEmail(registerInput.email())) {
            throw new BusinessException(ErrorCodes.VALIDATION_ERROR, "Email is already taken.", "email");
        }

        User user = new User();
        user.setFirstName(registerInput.firstName());
        user.setLastName(registerInput.lastName());
        user.setEmail(registerInput.email());
        user.setPassword(passwordEncoder.encode(registerInput.password()));

        Set<ERole> roles = new HashSet<>();
        roles.add(ERole.ROLE_RESIDENT);
        user.setRoles(roles);

        userRepository.save(user);
    }
}
