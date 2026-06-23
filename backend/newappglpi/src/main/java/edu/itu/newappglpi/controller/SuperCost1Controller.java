package edu.itu.newappglpi.controller;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import edu.itu.newappglpi.model.SuperCost1;


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
            WHERE etat_retablir = 1
            ORDER BY id DESC
        """);
    }

    @GetMapping("/all-supercost")
    public List<Map<String, Object>> findAllBySuperCost() {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at
            FROM super_cost_1
            WHERE type_cout="cout_saisi"
            and etat_retablir = 1
            ORDER BY id DESC
        """);
    }

    @GetMapping("/all-supercost-supprimer")
    public List<Map<String, Object>> findAllBySuperCostSupprimer() {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at
            FROM super_cost_1
            WHERE type_cout="cout_saisi"
            and etat_retablir = 0
            ORDER BY id DESC
        """);
    }

     @GetMapping("/all-reouverture")
    public List<Map<String, Object>> findAllByReouverture() {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at, pourcentage
            FROM super_cost_1
            WHERE type_cout="reouverture" 
            and etat_retablir = 1
            ORDER BY id DESC
        """);
    }

    @GetMapping("/max-glpi/{id_ticket}")
    public List<Map<String, Object>> findAllMaxGLPIByIdTicket(@PathVariable String id_ticket) {
        return jdbcTemplate.queryForList("""
            SELECT id ,id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, created_at
            FROM super_cost_1
            WHERE type_cout="glpi"
            AND  id_ticket = 752
            AND group_super_cost_1 = (
                SELECT MAX(group_super_cost_1)
                FROM super_cost_1
                WHERE id_ticket = 752
                AND type_cout="glpi"
                and etat_retablir = 1
            ) 
            and etat_retablir = 1
            GROUP BY id_item 
        """, id_ticket, id_ticket);
    }

    @GetMapping("/max-glpi")
    public List<Map<String, Object>> findAllMaxGLPI() {
        return jdbcTemplate.queryForList("""
            SELECT 
                sc.id,
                sc.id_ticket,
                sc.type_cout,
                sc.cout,
                sc.id_item,
                sc.category,
                sc.group_super_cost_1,
                sc.created_at
            FROM super_cost_1 sc
            WHERE sc.type_cout = 'glpi'
            AND sc.group_super_cost_1 = (
                SELECT MAX(sc2.group_super_cost_1)
                FROM super_cost_1 sc2
                WHERE sc2.type_cout = 'glpi'
                AND sc2.id_ticket = sc.id_ticket
                AND sc2.id_item = sc.id_item
                and etat_retablir = 1
            )
            and etat_retablir = 1
            ORDER BY sc.id_ticket, sc.id_item; 
        """);
    }

    @GetMapping("/reouverture/{id_ticket}")
    public List<Map<String, Object>> findSommeReouvertureByIdTicket(@PathVariable String id_ticket) {
        return jdbcTemplate.queryForList("""
            WHERE (
                type_cout = "reouverture"
                OR type_cout = "cout_saisi"
            )
            AND group_super_cost_1 = (
                SELECT MAX(group_super_cost_1)
                FROM super_cost_1
                WHERE id_ticket = ?
                and etat_retablir = 1
            )
            AND id_ticket = ?
            and etat_retablir = 1
        """,id_ticket);
    }

    @GetMapping({"/{id_ticket}/max/{group_super_cost}", "/{id_ticket}/max"})
    public List<Map<String, Object>> findByIdTicketGroupMax(@PathVariable String id_ticket, @PathVariable(required = false) String group_super_cost) {
        if (group_super_cost != null ) {
            return jdbcTemplate.queryForList("""
            SELECT id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
            FROM super_cost_1
            WHERE (
                id_ticket = ?
                AND type_cout="cout_saisi"
                AND group_super_cost_1 =(
                    SELECT MAX(group_super_cost_1)
                    FROM super_cost_1
                    WHERE id_ticket = ?
                    AND type_cout="cout_saisi"
                    AND group_super_cost_1 <= ? 
                    and etat_retablir = 1
                )
                AND group_super_cost_1 <= ? 
                and etat_retablir = 1
            ) GROUP BY id_item
        """, id_ticket, id_ticket, group_super_cost, group_super_cost);
        } else {
            return jdbcTemplate.queryForList("""
            SELECT id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
            FROM super_cost_1
            WHERE (
                id_ticket = ?
                AND type_cout="cout_saisi"
                AND group_super_cost_1 =(
                    SELECT MAX(group_super_cost_1)
                    FROM super_cost_1
                    WHERE id_ticket = ?
                    AND type_cout="cout_saisi"
                    and etat_retablir = 1
                )
                and etat_retablir = 1
            ) GROUP BY id_item
        """, id_ticket, id_ticket);
        }
        
        
    }

    @PutMapping("/update-supercost")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> updateSuperCostRestaure(
        @RequestBody SuperCost1 payload
    ) {
        jdbcTemplate.update(
            """
                UPDATE super_cost_1
                SET etat_retablir = 1
                WHERE id = ?
            """,
            payload.getId()
        );

        return jdbcTemplate.queryForList(
            """
                SELECT
                    id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE id = ?
            """,
            payload.getId()
        );
    }

    @PutMapping("/{just_number}/reouverture")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> updateReouverture(
        @RequestBody SuperCost1 payload
    ) {
        jdbcTemplate.update(
            """
                UPDATE super_cost_1
                SET cout = ?
                WHERE id_ticket = ?
                AND group_super_cost_1 = ?
                AND id_item = ?
                AND type_cout = "reouverture"
            """,
            payload.getCout(),
            payload.getIdTicket(),
            payload.getGroupSuperCost1(),
            payload.getIdItem()
        );

        return jdbcTemplate.queryForList(
            """
                SELECT
                    id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE id_ticket = ?
                AND group_super_cost_1 = ?
                AND id_item = ?
                AND type_cout = "reouverture"
            """,
            payload.getIdTicket(),
            payload.getGroupSuperCost1(),
            payload.getIdItem()

        );
    }

    @PutMapping("/{just_number}/cout-saisie")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> updateCoutSaisie(
        @RequestBody SuperCost1 payload
    ) {
        jdbcTemplate.update(
            """
                UPDATE super_cost_1
                SET cout = ?
                WHERE id_ticket = ?
                AND group_super_cost_1 = ?
                AND id_item = ?
                AND type_cout = "cout_saisi"
            """,
            payload.getCout(),
            payload.getIdTicket(),
            payload.getGroupSuperCost1(),
            payload.getIdItem()
        );

        return jdbcTemplate.queryForList(
            """
                SELECT
                    id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE id_ticket = ?
                AND group_super_cost_1 = ?
                AND id_item = ?
                AND type_cout = "cout_saisi"
            """,
            payload.getIdTicket(),
            payload.getGroupSuperCost1(),
            payload.getIdItem()

        );
    }


    @GetMapping({"/{id_ticket}/min/{group_super_cost}", "/{id_ticket}/min"})
    public List<Map<String, Object>> findByIdTicketGroupMin(@PathVariable String id_ticket, @PathVariable(required = false) String group_super_cost) {
        if (group_super_cost != null) {
            return jdbcTemplate.queryForList("""
                SELECT id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="cout_saisi"
                    AND group_super_cost_1 = (
                        SELECT MIN(group_super_cost_1)
                        FROM super_cost_1
                        WHERE id_ticket = ?
                        AND type_cout="cout_saisi"
                        AND group_super_cost_1 <= ?
                        and etat_retablir = 1
                    )
                    AND group_super_cost_1 <= ? 
                    and etat_retablir = 1
                ) GROUP BY id_item
            """, id_ticket, id_ticket, group_super_cost, group_super_cost);
        } else {
            return jdbcTemplate.queryForList("""
            SELECT id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at
            FROM super_cost_1
            WHERE (
                id_ticket = ?
                AND type_cout="cout_saisi"
                AND group_super_cost_1 = (
                    SELECT MIN(group_super_cost_1)
                    FROM super_cost_1
                    WHERE id_ticket = ?
                    AND type_cout="cout_saisi"
                    and etat_retablir = 1
                )
                and etat_retablir = 1
            ) GROUP BY id_item
        """, id_ticket, id_ticket);
        }
    }

    @GetMapping({"/{id_ticket}/moyenne/{group_super_cost}", "/{id_ticket}/moyenne"})
    public List<Map<String, Object>> findByIdTicketGroupMoyenne(@PathVariable String id_ticket, @PathVariable(required = false) String group_super_cost) {
        if (group_super_cost != null) {
            return jdbcTemplate.queryForList("""
                SELECT id, id_ticket, type_cout, avg(cout) as cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="cout_saisi"
                    AND group_super_cost_1 <= ?
                    and etat_retablir = 1
                ) GROUP BY id_item;
            """, id_ticket, group_super_cost);
        } else {
            return jdbcTemplate.queryForList("""
            SELECT id, id_ticket, type_cout, avg(cout) as cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="cout_saisi"
                    and etat_retablir = 1
                ) GROUP BY id_item;
            """, id_ticket);
        }
    }

    @GetMapping({"/{id_ticket}/somme/{group_super_cost}", "/{id_ticket}/somme", "/{id_ticket}/somme/{reouverture}/{group_super_cost}"})
    public List<Map<String, Object>> findByIdTicketGroupSomme(@PathVariable String id_ticket, @PathVariable(required = false) String group_super_cost, @PathVariable(required = false) String reouverture) {
        if (group_super_cost != null && reouverture != null) {
            return jdbcTemplate.queryForList("""
                SELECT id, id_ticket, type_cout, SUM(cout) as cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="reouverture"
                    AND group_super_cost_1 < ?
                    and etat_retablir = 1
                ) GROUP BY id_item
            """, id_ticket, group_super_cost);
        }

        if (group_super_cost != null) {
            return jdbcTemplate.queryForList("""
                SELECT id, id_ticket, type_cout, SUM(cout) as cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="cout_saisi"
                    AND group_super_cost_1 <= ?
                    and etat_retablir = 1
                ) GROUP BY id_item
            """, id_ticket, group_super_cost);
        } else {
            return jdbcTemplate.queryForList("""
                SELECT id, id_ticket, type_cout, SUM(cout) as cout, id_item, category, group_super_cost_1, created_at
                FROM super_cost_1
                WHERE (
                    id_ticket = ?
                    AND type_cout="cout_saisi"
                    and etat_retablir = 1
                ) GROUP BY id_item
            """, id_ticket);
        }
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
            WHERE etat_retablir = 1
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
                    WHERE id_ticket=
                    (
                        SELECT id_ticket FROM super_cost_1
                    )
                    and etat_retablir = 1
                ) 
                and etat_retablir = 1
            GROUP BY category, type_cout
        """);
    }

    @GetMapping("/get-supercost-reouverture/after-close/{group_super_cost}")
    public List<Map<String, Object>> findAllSuperCostReouvertureAfterClose(@PathVariable String group_super_cost) {
        return jdbcTemplate.queryForList("""
            SELECT id, id_ticket, type_cout, cout, id_item, category, group_super_cost_1, created_at, mode_reouverture, pourcentage
            FROM super_cost_1
            where group_super_cost_1 >= ?
            and type_cout="reouverture"
            and etat_retablir = 1
        """, group_super_cost);
    }


    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        
        if (body.get("etat_retablir") != null) {
            jdbcTemplate.update(
                "INSERT INTO super_cost_1 (id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, etat_retablir) VALUES (?, ?, ?, ?, ?, ?, ?)",
                body.get("id_ticket"),
                body.get("type_cout"),
                body.get("cout"),
                body.get("id_item"),
                body.get("category"),
                body.get("group_super_cost_1"),
                body.get("etat_retablir")
            );
        }
        
        if (body.get("mode_reouverture") != null && body.get("pourcentage") != null) {
            jdbcTemplate.update(
                "INSERT INTO super_cost_1 (id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1, mode_reouverture, pourcentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                body.get("id_ticket"),
                body.get("type_cout"),
                body.get("cout"),
                body.get("id_item"),
                body.get("category"),
                body.get("group_super_cost_1"),
                body.get("mode_reouverture"),
                body.get("pourcentage")
            );
        } else {
            jdbcTemplate.update(
                "INSERT INTO super_cost_1 (id_ticket ,type_cout, cout, id_item ,category , group_super_cost_1) VALUES (?, ?, ?, ?, ?, ?)",
                body.get("id_ticket"),
                body.get("type_cout"),
                body.get("cout"),
                body.get("id_item"),
                body.get("category"),
                body.get("group_super_cost_1")
            );
        }

        return Map.of("success", true);
    }

    @DeleteMapping
    public Map<String, Object> deleteAll() {
        jdbcTemplate.update("DELETE FROM super_cost_1");
        return Map.of("success", true);
    }

    // @DeleteMapping("/{id_ticket}/cout_saisie")
    // public Map<String, Object> deleteCoutSaisiMax(@PathVariable String id_ticket) {
    //     jdbcTemplate.update("""
    //         DELETE FROM super_cost_1 
    //         where id_ticket=?
    //         AND  group_super_cost_1 = (
    //             SELECT MAX(group_super_cost_1)
    //             FROM super_cost_1
    //             WHERE id_ticket=?
    //         )
    //         AND type_cout="cout_saisi"
    //     """,
    //         id_ticket, id_ticket);
    //     return Map.of("success", true);
    // }

// UPDATE super_cost_1
//                 SET etat_retablir = 1
//                 WHERE id = ?

    @DeleteMapping("/{id_ticket}/cout_saisie")
    public Map<String, Object> deleteCoutSaisiMax(@PathVariable String id_ticket) {
        jdbcTemplate.update("""
            UPDATE super_cost_1
            SET etat_retablir = 0
            where id_ticket=?
            AND  group_super_cost_1 = (
                SELECT MAX(group_super_cost_1)
                FROM super_cost_1
                WHERE id_ticket=?
            )
            AND type_cout="cout_saisi"
        """,
            id_ticket, id_ticket);
        return Map.of("success", true);
    }

    @DeleteMapping("/{id_ticket}")
    public Map<String, Object> deleteMax(@PathVariable String id_ticket) {
        jdbcTemplate.update("""
            DELETE FROM super_cost_1 
            where 
                group_super_cost_1 = (
                    SELECT MAX(group_super_cost_1)
                    FROM super_cost_1
                    WHERE id_ticket = ?
                )
            AND id_ticket= ?
        """,
            id_ticket, id_ticket
        );
        return Map.of("success", true);
    }
}
