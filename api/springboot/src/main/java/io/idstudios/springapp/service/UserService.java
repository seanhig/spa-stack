package io.idstudios.springapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import io.idstudios.springapp.dao.userdb.UserRepository;
import io.idstudios.springapp.model.payload.UserResponse;
import io.idstudios.springapp.model.userdb.User;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse getUserInfoById(Long id) {
        log.debug("Getting user info by id: {}", id);

        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: %s.".formatted(id)));

        return UserMapper.mapToUserResponse(user);
    }

}
