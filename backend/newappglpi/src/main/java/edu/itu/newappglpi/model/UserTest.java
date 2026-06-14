package edu.itu.newappglpi.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_test")
public class UserTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;
    @Column(name = "date_de_naissance", nullable = false)
    private LocalDate dateDeNaissance;
    @Column(name = "favorite_number", nullable = false)
    private Long favoriteNumber;
    @Column(name = "date_add", nullable = false)
    private LocalDateTime dateAdd;
    @Column(name = "date_update", nullable = false)
    private LocalDateTime dateUpdate;
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public LocalDate getDateDeNaissance() {
        return dateDeNaissance;
    }
    public void setDateDeNaissance(LocalDate dateDeNaissance) {
        this.dateDeNaissance = dateDeNaissance;
    }
    public Long getFavoriteNumber() {
        return favoriteNumber;
    }
    public void setFavoriteNumber(Long favoriteNumber) {
        this.favoriteNumber = favoriteNumber;
    }
    public LocalDateTime getDateAdd() {
        return dateAdd;
    }
    public void setDateAdd(LocalDateTime dateAdd) {
        this.dateAdd = dateAdd;
    }
    public LocalDateTime getDateUpdate() {
        return dateUpdate;
    }
    public void setDateUpdate(LocalDateTime dateUpdate) {
        this.dateUpdate = dateUpdate;
    }
    public boolean isDeleted() {
        return isDeleted;
    }
    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
