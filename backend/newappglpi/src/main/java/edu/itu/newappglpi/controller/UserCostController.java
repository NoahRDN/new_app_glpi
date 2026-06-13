package edu.itu.newappglpi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/user-cost")
public class UserCostController {

    private final JdbcTemplate jdbcTemplate;

    public UserCostController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("""
            SELECT id, montant, id_ticket
            FROM user_cost
            ORDER BY id DESC
        """);
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        jdbcTemplate.update(
            "INSERT INTO user_cost (montant, id_ticket) VALUES (?, ?)",
            body.get("montant"),
            body.get("id_ticket")
        );

        return Map.of("success", true);
    }

    @DeleteMapping
    public Map<String, Object> deleteAll() {
        jdbcTemplate.update("DELETE FROM user_cost");
        return Map.of("success", true);
    }

    @DeleteMapping("/{id_ticket}")
    public Map<String, Object> delete(@PathVariable String id_ticket) {
        System.out.println("resultat: " + id_ticket);
        jdbcTemplate.update("DELETE FROM user_cost where id_ticket= ?",
            id_ticket
        );
        return Map.of("success", true);
    }
}
