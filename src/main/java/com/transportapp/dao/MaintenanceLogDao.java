package com.transportapp.dao;

import com.transportapp.model.MaintenanceLog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

/**
 * JDBC-based DAO for MaintenanceLog CRUD operations.
 */
@Repository
public class MaintenanceLogDao {

    private final JdbcTemplate jdbcTemplate;

    public MaintenanceLogDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class MaintenanceRowMapper implements RowMapper<MaintenanceLog> {
        @Override
        public MaintenanceLog mapRow(ResultSet rs, int rowNum) throws SQLException {
            MaintenanceLog m = new MaintenanceLog();
            m.setId(rs.getLong("id"));
            m.setVehicleId(rs.getLong("vehicle_id"));
            Date d = rs.getDate("service_date");
            m.setServiceDate(d != null ? d.toLocalDate() : null);
            m.setDescription(rs.getString("description"));
            m.setCost(rs.getDouble("cost"));
            return m;
        }
    }

    public List<MaintenanceLog> findAll() {
        String sql = "SELECT * FROM maintenance_logs ORDER BY service_date DESC";
        return jdbcTemplate.query(sql, new MaintenanceRowMapper());
    }

    public int create(MaintenanceLog log) {
        String sql = "INSERT INTO maintenance_logs (vehicle_id, service_date, description, cost) " +
                "VALUES (?, ?, ?, ?)";
        LocalDate d = log.getServiceDate();
        return jdbcTemplate.update(sql,
                log.getVehicleId(),
                d,
                log.getDescription(),
                log.getCost());
    }

    public int delete(Long id) {
        String sql = "DELETE FROM maintenance_logs WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

