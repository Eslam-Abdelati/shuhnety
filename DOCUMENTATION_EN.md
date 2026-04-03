# 🚚 Shahnti Logistics Platform - Documentation

![Version](https://img.shields.io/badge/version-1.0.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-cyan?style=for-the-badge)
![Redux](https://img.shields.io/badge/Redux-7.2.0-purple?style=for-the-badge)

---

## 📖 1. Project Overview
**Shahnti** is a sophisticated logistics platform designed to modernize the freight and shipping industry in Egypt. It serves as a comprehensive digital ecosystem connecting Merchants (Cargo Owners), Drivers (Vehicle Owners), and Logistics Companies, while integration administrative oversight for Governorates and System Administrators.

The platform emphasizes a **Premium Digital Experience**, leveraging modern web technologies to ensure speed, security, and transparency in high-stakes logistics operations.

---

## 🎯 2. Vision & Goals
- **Full Digitalization**: Transitioning from traditional paper-based logistics to a seamless digital workflow.
- **Fair Market Dynamics**: Implementing a real-time bidding system to ensure fair pricing for merchants and optimal earnings for drivers.
- **Operational Security**: Real-time shipment tracking and rigorous verification of driver/vehicle credentials.
- **Regulatory Compliance**: Facilitating the collection of sovereign fees for governorates with automated reporting.

---

## 👥 3. User Personas & Journeys

| Role | Key Responsibilities |
| :--- | :--- |
| **Merchant (Customer)** | Create shipments, select best bids, track cargo in real-time, rate drivers. |
| **Driver** | Browse available loads, submit competitive bids, manage active trips, report road alerts. |
| **Logistics Company** | Fleet management, driver oversight, digital contract management, analytics. |
| **Governorate** | Monitor regional logistics flow, verify tax/fee receipts, generate movement reports. |
| **System Admin** | Platform governance, dispute resolution, system configuration, account verification. |

---

## ✨ 4. Core Features

### 📦 Smart Shipment Lifecycle
- End-to-end management from creation through bidding, pickup, transit, and delivery.
- Automated weight/dimension calculations and fee estimation.

### 💰 Dynamic Bidding System
- Real-time marketplace where drivers compete for shipments.
- Merchant dashboard for comparing offers based on price, rating, and vehicle capacity.

### 📍 Live Tracking & GIS
- Interactive maps showing real-time GPS locations of active shipments.
- Automated status triggers based on geofencing and checkpoint arrival.

### 🚨 Field Alert System (Road Wisdom)
- Crowdsourced reporting of accidents, congestion, or road closures to optimize routing for other drivers.

### 📄 Digital Contracts & Proof of Delivery
- Instant generation of legal digital contracts upon bid acceptance.
- Photo/E-signature verification for successful delivery.

---

## 🛠️ 5. Technical Stack

Shahnti is built on a modern, scalable stack:

- **Frontend**: `React 19` with `Vite` for ultra-fast development and build cycles.
- **Styling**: `Tailwind CSS 4` for a utility-first, performant design system.
- **Animations**: `Framer Motion` for smooth micro-interactions and transitions.
- **State Management**: `Redux Toolkit` for robust global state handling.
- **Routing**: `React Router 7` with role-based access control (RBAC).
- **Validation**: `Zod` integrated with `React Hook Form`.
- **Infrastructure**: Optimized for deployment on Netlify/Vercel with full CI/CD support.

---

## 📂 6. Architecture & Structure

```text
src/
├── api/                # Axios configuration and API endpoints
├── components/         # Shared UI components
│   └── ui/             # Atomic design components (Buttons, Inputs, etc.)
├── features/           # Domain-driven feature modules
│   ├── auth/           # Authentication and RBAC
│   ├── admin/          # Back-office management
│   ├── bidding/        # Real-time auction logic
│   ├── driver/         # Driver-specific workflows
│   ├── shipments/      # Core shipment management
│   └── tracking/       # Map integration and GPS logic
├── store/              # Global state (Slices & Hooks)
├── layouts/            # Page templates (Dashboard, Marketing)
├── routes/             # Route definitions and guards
└── utils/              # Helper functions (Date formatting, String manipulation)
```

---

## 🚀 7. Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file with your backend endpoint:
   ```env
   VITE_API_URL=your_api_endpoint
   ```

3. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---

<div align="center">
  <strong>This documentation is Part of the Technical Handover for the Shahnti Project</strong>
  <br>
  <sub>© 2026 Shahnti Dev Team - All Rights Reserved</sub>
</div>
