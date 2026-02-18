# Public Transport Fleet Scheduling & Breakdown Management System

Transport fleet scheduling and breakdown management web system that manages vehicles, drivers, routes, trip schedules, and repair tracking using a MySQL database to improve operational efficiency and reduce vehicle downtime.

Java Spring Boot + MySQL web application demonstrating:

- **User authentication** (admin login/logout)
- **Vehicle management** (CRUD + status)
- **Driver management** (CRUD + depot)
- **Route management** (CRUD)
- **Fleet scheduling** (assign vehicle + driver + route + date/time)
- **Breakdown reporting** (report + update status)
- **Maintenance logs** (repair history + cost)

The frontend is a responsive **HTML/CSS/JavaScript** dashboard (no frontend framework) consuming **REST endpoints** from a Spring Boot backend using **JDBC (JdbcTemplate)**. MySQL schema and sample data are created automatically using `schema.sql` and `data.sql`.

---

## Project structure (MVC-style)

```text
transport_app/
├─ pom.xml
├─ src/
│  ├─ main/
│  │  ├─ java/
│  │  │  └─ com/transportapp/
│  │  │     ├─ TransportAppApplication.java      # Spring Boot entry point
│  │  │     ├─ model/                           # Domain models
│  │  │     ├─ dao/                             # JDBC DAOs (CRUD)
│  │  │     └─ controller/                      # REST controllers
│  │  └─ resources/
│  │     ├─ application.properties              # DB config + init settings
│  │     ├─ schema.sql                          # MySQL schema (auto-run)
│  │     ├─ data.sql                            # Sample data (auto-run)
│  │     └─ static/                             # Frontend
│  │        ├─ index.html                       # Dashboard UI
│  │        ├─ css/styles.css                   # Responsive styling
│  │        └─ js/app.js                        # JS + form validation + API calls
```

---

## Prerequisites

- Java **17+**
- Maven **3.8+**
- MySQL server (local)

---

## Configure MySQL

1. Ensure MySQL is running locally.
2. Open `src/main/resources/application.properties` and set:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/transport_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

3. No need to manually create the schema – `schema.sql` and `data.sql` will run automatically on startup and will:
   - Create the `transport_db` database (if missing)
   - Create all tables
   - Insert sample data, including an admin user:
     - **Username**: `admin`
     - **Password**: `admin`

---

## Run the application locally

From the project root (`transport_app`), run:

```bash
mvn spring-boot:run
```

Once the build completes, open your browser and navigate to:

```text
http://localhost:8080/
```

Log in with:

- **Username**: `admin`
- **Password**: `admin`

---

## Notes

- **JDBC**: All database access is implemented using Spring's `JdbcTemplate` in the `dao` package.
- **Form validation**: `static/js/app.js` contains simple client-side validation for required fields and basic formats.
- **CRUD operations**: Each module (vehicles, drivers, routes, schedules, breakdowns, maintenance) has dedicated REST controllers and DAOs.
- **Responsive UI**: `static/css/styles.css` uses flexbox + grid to provide a dashboard-style layout that works on desktop and mobile.
