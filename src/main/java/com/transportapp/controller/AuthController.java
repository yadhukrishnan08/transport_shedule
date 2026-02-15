package com.transportapp.controller;

import com.transportapp.dao.UserDao;
import com.transportapp.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Simple authentication controller for admin login/logout.
 * The frontend uses these endpoints via AJAX.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserDao userDao;

    public AuthController(UserDao userDao) {
        this.userDao = userDao;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
            @RequestParam String password,
            HttpSession session) {
        try {
            User user = userDao.findByUsername(username);
            if (user != null && user.getPassword().equals(password)) {
                session.setAttribute("user", user);
                Map<String, Object> resp = new HashMap<>();
                resp.put("username", user.getUsername());
                resp.put("role", user.getRole());
                return ResponseEntity.ok(resp);
            }
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok(user);
    }
}
