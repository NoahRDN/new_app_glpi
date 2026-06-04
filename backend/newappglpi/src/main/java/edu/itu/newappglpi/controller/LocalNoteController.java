package edu.itu.newappglpi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/local-notes")
public class LocalNoteController {

    private final JdbcTemplate jdbcTemplate;

    public LocalNoteController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("""
            SELECT id, glpi_user_id, note, created_at
            FROM local_notes
            ORDER BY id DESC
        """);
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        jdbcTemplate.update(
            "INSERT INTO local_notes (glpi_user_id, note) VALUES (?, ?)",
            body.get("glpiUserId"),
            body.get("note")
        );

        return Map.of("success", true);
    }
}