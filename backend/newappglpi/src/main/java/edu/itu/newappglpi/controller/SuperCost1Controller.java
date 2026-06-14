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
@RequestMapping("/api/user-cost-1")
public class SuperCost1Controller {

    private final JdbcTemplate jdbcTemplate;

    public SuperCost1Controller(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at
            FROM super_cost_1
            ORDER BY id DESC
        """);
    }

    // @GetMapping("/group-by-category")
    // public List<Map<String, Object>> findAllGroupByCategory() {
    //     return jdbcTemplate.queryForList("""
    //         SELECT category ,count(id_item) AS nombre_asset, SUM(cout_saisi)AS cout_saisi , SUM(cout_glpi) AS cout_glpi, (SUM(cout_saisi) + SUM(cout_glpi)) AS total 
    //         FROM super_cost
    //         GROUP BY category
    //     """);
    // }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        jdbcTemplate.update(
            "INSERT INTO super_cost_1 (id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1) VALUES (?, ?, ?, ?, ?, ?)",
            body.get("id_ticket"),
            body.get("type_cout"),
            body.get("cout"),
            body.get("id_item"),
            body.get("category"),
            body.get("group_super_cost_1")
        );

        return Map.of("success", true);
    }

    @DeleteMapping
    public Map<String, Object> deleteAll() {
        jdbcTemplate.update("DELETE FROM super_cost_1");
        return Map.of("success", true);
    }

    @DeleteMapping("/{id_ticket}")
    public Map<String, Object> delete(@PathVariable String id_ticket) {
        jdbcTemplate.update("DELETE FROM super_cost_1 where id_ticket= ?",
            id_ticket
        );
        return Map.of("success", true);
    }
}
