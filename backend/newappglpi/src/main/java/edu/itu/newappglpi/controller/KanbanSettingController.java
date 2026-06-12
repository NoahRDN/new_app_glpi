package edu.itu.newappglpi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import edu.itu.newappglpi.model.KanbanSetting;

@RestController
@RequestMapping("/api/kanban-settings")
@CrossOrigin(origins = "http://localhost:5173")
public class KanbanSettingController {

    private final JdbcTemplate jdbcTemplate;

    public KanbanSettingController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<KanbanSetting> findAll() {
        return jdbcTemplate.query(
            """
                SELECT
                    column_key,
                    label_mg,
                    background_color,
                    display_order
                FROM kanban_settings
                ORDER BY display_order ASC
            """,
            (resultSet, rowNum) -> {
                KanbanSetting setting = new KanbanSetting();
                setting.setColumnKey(resultSet.getString("column_key"));
                setting.setLabelMg(resultSet.getString("label_mg"));
                setting.setBackgroundColor(resultSet.getString("background_color"));
                setting.setDisplayOrder(resultSet.getInt("display_order"));
                return setting;
            }
        );
    }

    @PutMapping("/{columnKey}")
    @ResponseStatus(HttpStatus.OK)
    public KanbanSetting update(
        @PathVariable String columnKey,
        @RequestBody KanbanSetting payload
    ) {
        if (payload.getLabelMg() == null || payload.getLabelMg().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "labelMg is required");
        }

        if (payload.getBackgroundColor() == null || payload.getBackgroundColor().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "backgroundColor is required");
        }

        int updatedRows = jdbcTemplate.update(
            """
                UPDATE kanban_settings
                SET label_mg = ?, background_color = ?
                WHERE column_key = ?
            """,
            payload.getLabelMg().trim(),
            payload.getBackgroundColor().trim(),
            columnKey
        );

        if (updatedRows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kanban setting not found");
        }

        return jdbcTemplate.queryForObject(
            """
                SELECT
                    column_key,
                    label_mg,
                    background_color,
                    display_order
                FROM kanban_settings
                WHERE column_key = ?
            """,
            (resultSet, rowNum) -> {
                KanbanSetting setting = new KanbanSetting();
                setting.setColumnKey(resultSet.getString("column_key"));
                setting.setLabelMg(resultSet.getString("label_mg"));
                setting.setBackgroundColor(resultSet.getString("background_color"));
                setting.setDisplayOrder(resultSet.getInt("display_order"));
                return setting;
            },
            columnKey
        );
    }
}
