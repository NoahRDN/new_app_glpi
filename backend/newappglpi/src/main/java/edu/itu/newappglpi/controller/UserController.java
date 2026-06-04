package edu.itu.newappglpi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.itu.newappglpi.model.UserEntity;
import edu.itu.newappglpi.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserEntity> getUsers() {
        return userRepository.findByIsDeletedFalse();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody UserEntity user) {
        user.setId(null);
        user.setIsDeleted(false);
        return userRepository.save(user);
    }

    @PatchMapping("/{id}")
    public UserEntity updateUser(@PathVariable Long id, @RequestBody UserEntity payload) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (payload.getUsername() != null) user.setUsername(payload.getUsername());
        if (payload.getRealname() != null) user.setRealname(payload.getRealname());
        if (payload.getFirstname() != null) user.setFirstname(payload.getFirstname());

        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsDeleted(true);
        userRepository.save(user);
    }
}
