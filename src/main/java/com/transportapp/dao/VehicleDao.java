package com.transportapp.dao;

import com.transportapp.model.Vehicle;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * JDBC-based DAO for Vehicle CRUD operations.
 */
@Repository
public class VehicleDao {

    private final JdbcTemplate jdbcTemplate;

    public VehicleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class VehicleRowMapper implements RowMapper<Vehicle> {
        @Override
        public Vehicle mapRow(ResultSet rs, int rowNum) throws SQLException {
            Vehicle v = new Vehicle();
            v.setId(rs.getLong("id"));
            v.setRegistrationNumber(rs.getString("registration_number"));
            v.setType(rs.getString("type"));
            v.setDepot(rs.getString("depot"));
            v.setStatus(rs.getString("status"));
            return v;
        }
    }

    public List<Vehicle> findAll() {
        String sql = "SELECT * FROM vehicles ORDER BY id";
        return jdbcTemplate.query(sql, new VehicleRowMapper());
    }

    public Vehicle findById(Long id) {
        String sql = "SELECT * FROM vehicles WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new VehicleRowMapper(), id);
    }

    public int create(Vehicle vehicle) {
        String sql = "INSERT INTO vehicles (registration_number, type, depot, status) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                vehicle.getRegistrationNumber(),
                vehicle.getType(),
                vehicle.getDepot(),
                vehicle.getStatus());
    }

    public int update(Vehicle vehicle) {
        String sql = "UPDATE vehicles SET registration_number = ?, type = ?, depot = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                vehicle.getRegistrationNumber(),
                vehicle.getType(),
                vehicle.getDepot(),
                vehicle.getStatus(),
                vehicle.getId());
    }

    public int delete(Long id) {
        String sql = "DELETE FROM vehicles WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

