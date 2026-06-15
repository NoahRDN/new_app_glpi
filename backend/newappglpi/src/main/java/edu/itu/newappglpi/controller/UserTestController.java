package edu.itu.newappglpi.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import edu.itu.newappglpi.model.UserTest;

@RestController
@RequestMapping("/api/user-test")
@CrossOrigin(origins = "http://localhost:5173")
public class UserTestController {
    private final JdbcTemplate jdbcTemplate;
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public UserTestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<UserTest> findAll() {
        return jdbcTemplate.query(
            """
                SELECT
                    id,
                    nom,
                    prenom,
                    date_de_naissance,
                    favorite_number,
                    date_add,
                    date_update,
                    is_deleted
                FROM user_test
                ORDER BY id DESC
            """,
            (resultSet, rowNum) -> mapResultSet(resultSet.getLong("id"), resultSet.getString("nom"),
                resultSet.getString("prenom"), resultSet.getString("date_de_naissance"),
                resultSet.getLong("favorite_number"), resultSet.getString("date_add"),
                resultSet.getString("date_update"), resultSet.getLong("is_deleted"))
        );
    }

    @GetMapping("/{id}")
    public UserTest findById(@PathVariable Long id) {
        return findExistingUserTest(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserTest create(@RequestBody Map<String, Object> body) {
        validateBody(body);

        jdbcTemplate.update(
            """
                INSERT INTO user_test (nom, prenom, date_de_naissance, favorite_number)
                VALUES (?, ?, ?, ?)
            """,
            body.get("nom"),
            body.get("prenom"),
            body.get("dateDeNaissance"),
            body.get("favoriteNumber")
        );

        Long createdId = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);

        if (createdId == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to create user test");
        }

        return findExistingUserTest(createdId);
    }

    @PutMapping("/{id}")
    public UserTest update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        UserTest existingUser = findExistingUserTest(id);
        validateBody(body);

        jdbcTemplate.update(
            """
                UPDATE user_test
                SET
                    nom = ?,
                    prenom = ?,
                    date_de_naissance = ?,
                    favorite_number = ?,
                    date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            """,
            body.get("nom"),
            body.get("prenom"),
            body.get("dateDeNaissance"),
            body.get("favoriteNumber"),
            id
        );

        return findExistingUserTest(existingUser.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        findExistingUserTest(id);

        jdbcTemplate.update(
            """
                UPDATE user_test
                SET
                    is_deleted = 1,
                    date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            """,
            id
        );
    }

    private UserTest findExistingUserTest(Long id) {
        List<UserTest> users = jdbcTemplate.query(
            """
                SELECT
                    id,
                    nom,
                    prenom,
                    date_de_naissance,
                    favorite_number,
                    date_add,
                    date_update,
                    is_deleted
                FROM user_test
                WHERE id = ?
            """,
            (resultSet, rowNum) -> mapResultSet(resultSet.getLong("id"), resultSet.getString("nom"),
                resultSet.getString("prenom"), resultSet.getString("date_de_naissance"),
                resultSet.getLong("favorite_number"), resultSet.getString("date_add"),
                resultSet.getString("date_update"), resultSet.getLong("is_deleted")),
            id
        );

        if (users.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User test not found");
        }

        return users.get(0);
    }

    private UserTest mapResultSet(
        Long id,
        String nom,
        String prenom,
        String dateDeNaissance,
        Long favoriteNumber,
        String dateAdd,
        String dateUpdate,
        Long isDeleted
    ) {
        UserTest userTest = new UserTest();
        userTest.setId(id);
        userTest.setNom(nom);
        userTest.setPrenom(prenom);
        userTest.setDateDeNaissance(LocalDate.parse(dateDeNaissance, dateFormatter));
        userTest.setFavoriteNumber(favoriteNumber);
        userTest.setDateAdd(parseDateTime(dateAdd));
        userTest.setDateUpdate(parseDateTime(dateUpdate));
        userTest.setDeleted(isDeleted != null && isDeleted != 0);
        return userTest;
    }

    private void validateBody(Map<String, Object> body) {
        if (isBlank(body.get("nom"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nom is required");
        }

        if (isBlank(body.get("prenom"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "prenom is required");
        }

        if (isBlank(body.get("dateDeNaissance"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "dateDeNaissance is required");
        }

        if (body.get("favoriteNumber") == null || isBlank(body.get("favoriteNumber"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "favoriteNumber is required");
        }
    }

    private boolean isBlank(Object value) {
        return value == null || String.valueOf(value).trim().isEmpty();
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        // Format ISO : 2026-06-17T13:15:00.000Z
        if (value.contains("T")) {
            return OffsetDateTime.parse(value).toLocalDateTime();
        }

        // Format SQLite : 2026-06-17 13:15:00
        return LocalDateTime.parse(value, dateTimeFormatter);
    }
}
