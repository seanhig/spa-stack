package io.idstudios.springapp.service;

import io.idstudios.springapp.model.payload.UserResponse;
import io.idstudios.springapp.model.userdb.User;

public class UserMapper {

    public static UserResponse mapToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setUserName(user.getEmail());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setLastname(user.getLastname());
        return userResponse;
    }

}
