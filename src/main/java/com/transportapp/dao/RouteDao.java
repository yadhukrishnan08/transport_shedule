package com.transportapp.dao;

import com.transportapp.model.Route;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * JDBC-based DAO for Route CRUD operations.
 */
@Repository
public class RouteDao {

    private final JdbcTemplate jdbcTemplate;

    public RouteDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class RouteRowMapper implements RowMapper<Route> {
        @Override
        public Route mapRow(ResultSet rs, int rowNum) throws SQLException {
            Route r = new Route();
            r.setId(rs.getLong("id"));
            r.setCode(rs.getString("code"));
            r.setOrigin(rs.getString("origin"));
            r.setDestination(rs.getString("destination"));
            r.setDistanceKm(rs.getString("distance_km"));
            return r;
        }
    }

    public List<Route> findAll() {
        String sql = "SELECT * FROM routes ORDER BY id";
        return jdbcTemplate.query(sql, new RouteRowMapper());
    }

    public Route findById(Long id) {
        String sql = "SELECT * FROM routes WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new RouteRowMapper(), id);
    }

    public int create(Route route) {
        String sql = "INSERT INTO routes (code, origin, destination, distance_km) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                route.getCode(),
                route.getOrigin(),
                route.getDestination(),
                route.getDistanceKm());
    }

    public int update(Route route) {
        String sql = "UPDATE routes SET code = ?, origin = ?, destination = ?, distance_km = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                route.getCode(),
                route.getOrigin(),
                route.getDestination(),
                route.getDistanceKm(),
                route.getId());
    }

    public int delete(Long id) {
        String sql = "DELETE FROM routes WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

