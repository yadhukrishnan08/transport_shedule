package com.transportapp.dao;

import com.transportapp.model.Breakdown;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * JDBC-based DAO for Breakdown reporting and status updates.
 */
@Repository
public class BreakdownDao {

    private final JdbcTemplate jdbcTemplate;

    public BreakdownDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class BreakdownRowMapper implements RowMapper<Breakdown> {
        @Override
        public Breakdown mapRow(ResultSet rs, int rowNum) throws SQLException {
            Breakdown b = new Breakdown();
            b.setId(rs.getLong("id"));
            b.setVehicleId(rs.getLong("vehicle_id"));
            long scheduleId = rs.getLong("schedule_id");
            b.setScheduleId(rs.wasNull() ? null : scheduleId);
            Timestamp reportedTs = rs.getTimestamp("reported_at");
            b.setReportedAt(reportedTs != null ? reportedTs.toLocalDateTime() : null);
            b.setDescription(rs.getString("description"));
            b.setStatus(rs.getString("status"));
            return b;
        }
    }

    public List<Breakdown> findAll() {
        String sql = "SELECT * FROM breakdowns ORDER BY reported_at DESC";
        return jdbcTemplate.query(sql, new BreakdownRowMapper());
    }

    public int create(Breakdown breakdown) {
        String sql = "INSERT INTO breakdowns (vehicle_id, schedule_id, reported_at, description, status) " +
                "VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                breakdown.getVehicleId(),
                breakdown.getScheduleId(),
                breakdown.getReportedAt(),
                breakdown.getDescription(),
                breakdown.getStatus());
    }

    public int updateStatus(Long id, String status) {
        String sql = "UPDATE breakdowns SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, id);
    }
}

