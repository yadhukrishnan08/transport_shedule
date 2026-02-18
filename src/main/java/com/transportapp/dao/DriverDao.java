package com.transportapp.dao;

import com.transportapp.model.Driver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * JDBC-based DAO for Driver CRUD operations.
 */
@Repository
public class DriverDao {

    private final JdbcTemplate jdbcTemplate;

    public DriverDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class DriverRowMapper implements RowMapper<Driver> {
        @Override
        public Driver mapRow(ResultSet rs, int rowNum) throws SQLException {
            Driver d = new Driver();
            d.setId(rs.getLong("id"));
            d.setName(rs.getString("name"));
            d.setLicenseNumber(rs.getString("license_number"));
            d.setPhone(rs.getString("phone"));
            d.setDepot(rs.getString("depot"));
            d.setUsername(rs.getString("username"));
            return d;
        }
    }

    public List<Driver> findAll() {
        String sql = "SELECT * FROM drivers ORDER BY id";
        return jdbcTemplate.query(sql, new DriverRowMapper());
    }

    public Driver findById(Long id) {
        String sql = "SELECT * FROM drivers WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new DriverRowMapper(), id);
    }

    public int create(Driver driver) {
        String sql = "INSERT INTO drivers (name, license_number, phone, depot, username) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                driver.getName(),
                driver.getLicenseNumber(),
                driver.getPhone(),
                driver.getDepot(),
                driver.getUsername());
    }

    public int update(Driver driver) {
        String sql = "UPDATE drivers SET name = ?, license_number = ?, phone = ?, depot = ?, username = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                driver.getName(),
                driver.getLicenseNumber(),
                driver.getPhone(),
                driver.getDepot(),
                driver.getUsername(),
                driver.getId());
    }

    public int delete(Long id) {
        String sql = "DELETE FROM drivers WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
