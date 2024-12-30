# Inter-Provincial Bus Booking System (busriya.com) - API Design - SRI LANKA (Microservices Architecture With Event Driven Communication)

(YR3COBSCCOMP232P002)

Welcome to the backend of the **Inter-Provincial Bus Booking System (busriya.com)**. This project is built using a microservices architecture, aiming to streamline bus bookings across provinces. The system is designed for scalability, security, and robustness, currently in its **initial stage**.

### Exhibit Client

- **Website**: [https://www.busriya.com](https://www.busriya.com)
- **Git Repository**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/booking-client)

### Core Services

- **Core Service**: [https://api.busriya.com/core-service/v2.0](https://api.busriya.com/core-service/v2.0)

  - **Swagger**: [https://api.busriya.com/core-service/api-docs](https://api.busriya.com/core-service/api-docs)
  - **Git Repository**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/core-service)

- **Trip Service**: [https://api.busriya.com/trip-service/v1.3](https://api.busriya.com/trip-service/v1.3)

  - **Swagger**: [https://api.busriya.com/trip-service/api-docs](https://api.busriya.com/trip-service/api-docs)
  - **Git Repository**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/trip-service)

- **Booking Service**: [https://api.busriya.com/booking-service/v1.7](https://api.busriya.com/booking-service/v1.7)
  - **Swagger**: [https://api.busriya.com/booking-service/api-docs](https://api.busriya.com/booking-service/api-docs)
  - **Git Repository**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/booking-service)

### Support Services

- **Core Support Service**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/core-support-service)
- **Trip Support Service**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/trip-support-service)
- **Booking Support Service**: [Git Link](https://github.com/sanuga-lakdinu-kuruppu/booking-support-service)

---

## 📜 **System Overview**

The backend system facilitates:

- **Bus bookings**: Seamless booking and payment process.
- **Trip management**: Managing trip data and schedules.
- **Core administration**: Handling master data, stations, vehicles, policies, and operators.

### Architecture Highlights:

- **Microservices Architecture** for modularity and scalability.
- Deployed in **AWS Lambda** for serverless execution.
- Integrated with modern AWS services for efficiency and reliability.

---

## 🏗️ **System Architecture**

![Architecture Diagram](https://busriya-architecture.s3.ap-southeast-1.amazonaws.com/busriya.com.png)

---

## 🛠️ **Microservices Overview**

### Core Services:

1. **Core Service**:  
   Handles administration tasks, including:

   - Master Data
   - Stations, Policies, Permits
   - Vehicles, Schedules
   - Bus Workers, Operators

2. **Trip Service**:  
   Manages all trip-related data, including:

   - Trip details
   - Schedules

3. **Booking Service**:  
   Covers the booking lifecycle, such as:
   - Bookings and Payments
   - OTP Verification
   - Lost Parcels Handling
   - Commuter Data

### Support Services:

- **Core Support Service**: For inter-service communication and backup and deletion processes (midnight jobs).
- **Booking Support Service**: For inter-service communication and backup and deletion processes (midnight jobs).
- **Trip Support Service**: For inter-service communication and backup and deletion processes (midnight jobs).

---

## 🌐 **Deployment and Infrastructure**

### AWS Services:

- **API Gateway**: Exposes endpoints for all microservices.
- **Cognito**: Manages user authentication and access control.
- **SES**: Sends emails for notifications and OTPs.
- **EventBridge**: Coordinates inter-service events, including:
  - Nightly Jobs
  - Data Backups
  - Record Deletion

### Monitoring & Security:

- **CloudWatch**: Tracks logs and monitors performance.
- **IAM**: Manages access policies.
- **S3**: Stores backups and data for analysis.

### Database:

- **MongoDB Atlas**: Cloud-based NoSQL database for all services.

### Networking:

- **Cloudflare**: DNS with:
  - Web Application Firewall (WAF)
  - Country-specific access rules

---

## 📊 **Data Insights**

- **Backup Storage**: Periodically stored in S3 (data retained for 7 days).
- **Data Analysis**: Enables pattern recognition for better insights (3rd stage).

---

## 🚀 **How to Get Started**

1. Clone the repository:
   ```bash
   git clone https://github.com/sanuga-lakdinu-kuruppu/core-service.git
   ```

---

## 📧 **Contact**

If you have any questions or need assistance, please reach out to [sanugakuruppu.info@gmail.com](mailto:sanugakuruppu.info@gmail.com).
