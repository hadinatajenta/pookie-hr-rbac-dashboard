# Pookie HR RBAC Dashboard

A high-performance, secure, and professional human resources management interface designed for enterprise-grade Role-Based Access Control (RBAC). This project serves as the primary frontend orchestration layer for the Pookie ecosystem, offering a seamless user experience for managing identities, permissions, and organizational assets.

## Project Overview

The Pookie HR RBAC Dashboard is engineered to provide administrative clarity and operational security. By integrating advanced state management and real-time data fetching patterns, the system ensures that organizational data is always accurate and accessible. The application is built with a focus on modularity, allowing for easy expansion as business requirements evolve.

### Core Value Propositions

*   Experience: Developed using modern React 19 patterns to ensure scalability and maintainability.
*   Expertise: Implements industry-standard security protocols for session management and authorization.
*   Authoritativeness: Serves as a centralized hub for Identity and Access Management (IAM) within the workspace.
*   Trustworthiness: Built with transparent error handling and robust data validation to maintain data integrity.

## Key Features

### Identity and Access Management (IAM)
The application handles complex authentication and authorization flows through a dedicated middleware layer. It supports granular permission checking, ensuring that users only access resources relevant to their assigned roles.

### Dynamic Menu System
Utilizing a Stale-While-Revalidate (SWR) pattern, the navigation system provides instant feedback by serving cached data while simultaneously refreshing the menu structure from the server in the background. This ensures zero perceived latency for the end-user.

### Unified State Management
A centralized state architecture powered by Zustand manages user profiles, theme preferences, and navigational data. This reduces redundant network requests and ensures a consistent visual state throughout the application.

### Responsive Dark Mode
Featuring a premium dark mode implementation that respects user preferences and improves accessibility during long working hours. The design utilizes a curated color palette for maximum readability and visual comfort.

## Technology Stack

*   Framework: React 19 with Vite for lightning-fast builds and Hot Module Replacement (HMR).
*   Styling: Tailwind CSS 4.0 for utility-first, modern responsive design.
*   State Management: Zustand for lightweight yet powerful global state orchestration.
*   Data Fetching: Axios with centralized interceptors for automatic token attachment and 401/403 error handling.
*   Icons: Lucide React for consistent and accessible iconography.

## Architecture and Integration

The frontend communicates with a Go-based Auth Service that handles the heavy lifting of database migrations, JWT issuance, and RBAC logic. 

*   API Layer: Centralized in `src/api/index.js` to manage all outgoing communication with a consistent base URL and security headers.
*   Context Layer: `AuthContext.jsx` provides a high-level abstraction for login and logout operations, keeping the UI decoupled from raw API logic.
*   Service Layer: Domain-specific services (User, Menu) encapsulate the business logic for data transformations.

## Getting Started

### Prerequisites

*   Node.js (latest LTS version recommended)
*   npm or yarn
*   A running instance of the Pookie Auth Service

### Installation

1.  Clone the repository to your local machine.
2.  Navigate to the directory in your terminal.
3.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server with:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Contribution Standards

To maintain the quality and performance of this project:
*   Follow established React functional patterns.
*   Ensure all new features are documented and tested.
*   Use the centralized API instance for all network communication.
*   Adhere to the atomic design principles practiced in the component library.
