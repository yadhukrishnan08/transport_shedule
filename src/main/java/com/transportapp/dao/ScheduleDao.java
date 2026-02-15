package com.transportapp.dao;

import com.transportapp.model.Schedule;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * JDBC-based DAO for Schedule CRUD operations.
 */
@Repository
public class ScheduleDao {

    private final JdbcTemplate jdbcTemplate;

    public ScheduleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class ScheduleRowMapper implements RowMapper<Schedule> {
        @Override
        public Schedule mapRow(ResultSet rs, int rowNum) throws SQLException {
            Schedule s = new Schedule();
            s.setId(rs.getLong("id"));
            s.setVehicleId(rs.getLong("vehicle_id"));
            s.setDriverId(rs.getLong("driver_id"));
            s.setRouteId(rs.getLong("route_id"));
            Timestamp depTs = rs.getTimestamp("departure_time");
            Timestamp arrTs = rs.getTimestamp("arrival_time");
            s.setDepartureTime(depTs != null ? depTs.toLocalDateTime() : null);
            s.setArrivalTime(arrTs != null ? arrTs.toLocalDateTime() : null);
            return s;
        }
    }

    public List<Schedule> findAll() {
        String sql = "SELECT * FROM schedules ORDER BY departure_time DESC";
        return jdbcTemplate.query(sql, new ScheduleRowMapper());
    }

    public int create(Schedule schedule) {
        String sql = "INSERT INTO schedules (vehicle_id, driver_id, route_id, departure_time, arrival_time) " +
                "VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                schedule.getVehicleId(),
                schedule.getDriverId(),
                schedule.getRouteId(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime());
    }

    public int update(Schedule schedule) {
        String sql = "UPDATE schedules SET vehicle_id = ?, driver_id = ?, route_id = ?, " +
                "departure_time = ?, arrival_time = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                schedule.getVehicleId(),
                schedule.getDriverId(),
                schedule.getRouteId(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                schedule.getId());
    }

    public int delete(Long id) {
        String sql = "DELETE FROM schedules WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

