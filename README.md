# Public Transport Fleet Scheduling System

A web-based application for managing public transport fleet schedules, driver assignments, and breakdown maintenance. Built with **Spring Boot** and **MySQL**.

## 🚀 Features

### 🛠 Role-Based Management
- **Admin**: Manage vehicles, routes, schedules, and assign drivers.
- **Driver**: View assigned schedules and report breakdowns.
- **Mechanic**: View assigned maintenance tasks and update repair status.

### 🚌 Fleet & Operations
- **Vehicle Management**: Track fleet inventory and status.
- **Route Planning**: Manage transport routes and timings.
- **Scheduling**: Automated/Manual scheduling of trips.
- **Breakdown Management**: Report and track vehicle breakdowns and maintenance logs.

## 🛠 Tech Stack

- **Backend**: Java 17, Spring Boot 3.3.2 (Web, JDBC)
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Build Tool**: Maven

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yadhukrishnan08/transport_shedule.git
   cd transport_shedule
   ```

2. **Configure Database**
   Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/transport_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and Run**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the Application**
   Open your browser and navigate to: `http://localhost:8080`

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
