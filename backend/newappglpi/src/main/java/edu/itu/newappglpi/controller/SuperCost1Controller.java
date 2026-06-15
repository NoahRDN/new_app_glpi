package edu.itu.newappglpi.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

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

    @GetMapping("/reouverture/{id_ticket}")
    public List<Map<String, Object>> findSommeReouvertureByIdTicket(@PathVariable String id_ticket) {
        return jdbcTemplate.queryForList("""
            SELECT SUM(cout)
            FROM super_cost_1
            WHERE type_cout="reouverture"
            OR type_cout="cout_saisi"
            AND group_super_cost_1 = (
                SELECT MAX(group_super_cost_1)
                FROM super_cost_1
            )
            AND id_ticket= ?
        """,id_ticket);
    }

    @GetMapping("/{id_ticket}")
    public List<Map<String, Object>> findByIdTicketGroupMax(@PathVariable String id_ticket) {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at
            FROM super_cost_1 WHERE id_ticket= ?
            ORDER BY group_super_cost_1 DESC
            LIMIT 1;
        """, id_ticket);
    }

    @GetMapping("/group-by-category-type-cout")
    public List<Map<String, Object>> findAllGroupByCategoryTypeCout() {
        return jdbcTemplate.queryForList("""
            SELECT 
                category,
                type_cout,
                COUNT(id_item) AS nombre_asset,
                SUM(cout) AS cout
            FROM super_cost_1
            GROUP BY category, type_cout
        """);
    }

    @GetMapping("/group-by-category-type-cout/last-max")
    public List<Map<String, Object>> findAllGroupByCategoryTypeCoutLastMax() {
        return jdbcTemplate.queryForList("""
            SELECT 
                category,
                type_cout,
                COUNT(id_item) AS nombre_asset,
                SUM(cout) AS cout
            FROM super_cost_1
            where 
                group_super_cost_1 = (
                    SELECT MAX(group_super_cost_1)
                    FROM super_cost_1
                ) 
            GROUP BY category, type_cout
        """);
    }


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
        jdbcTemplate.update("""
            DELETE FROM super_cost_1 
            where 
                group_super_cost_1 = (
                    SELECT MAX(group_super_cost_1)
                    FROM super_cost_1
                )
            AND id_ticket= ?
            AND type_cout="cout_saisi"
        """,
            id_ticket
        );
        return Map.of("success", true);
    }
}
