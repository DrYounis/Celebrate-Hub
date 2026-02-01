# Celebrate Hub Project Structure (MVP)

> **Technical Readme**
> This document outlines the technical architecture, folder structure, and development roadmap for the Celebrate Hub MVP (Minimum Viable Product).

## 📂 Folders Architecture

* **/client**: React/Next.js application (Frontend).
  * `app/`: Next.js App Router pages and layouts.
  * `components/`: Reusable UI components (Buttons, Cards, Forms).
  * `lib/`: Utility functions and helper classes.
* **/server**: Node.js & Express API (Backend).
  * `models/`: Database schemas (Mongoose models).
  * `routes/`: API endpoints definitions.
  * `controllers/`: Logic for handling requests.
* **/assets**: Branding materials (Logos, Hail city icons, specific fonts).
* **/docs**: Business model, presentation files, and design prompts.

---

## 🛠️ MVP Core Modules (Task List)

### 1. Auth Module 🔐
* [ ] **User Registration/Login**: Secure sign-up/in for end-users.
* [ ] **Provider Registration/Login**: Specialized sign-up asking for business details.
* [ ] **JWT Implementation**: Secure session management.

### 2. Provider Profile & Dashboard 🏢
* [ ] **Service Listing**: Ability for providers to add services (Halls, Catering, etc.).
* [ ] **Pricing Management**: Set standard prices and special offers.
* [ ] **Gallery**: Upload photos of previous work/venues.

### 3. Booking Engine 📅
* [ ] **Availability Calendar**: Check if a venue/service is free on a specific date.
* [ ] **Booking Request**: User sends a request, Provider accepts/rejects.

### 4. Budget Engine (AI-Ready) 💰
* [ ] **Algorithm**: Logic to distribute a total user budget across selected categories.
  * *Example: Budget 20k -> 10k Hall, 5k Food, 5k Extras.*
* [ ] **Recommendation**: Suggest specific providers that fit within the allocated sub-budgets.

### 5. Payment Gateway 💳
* [ ] **Integration Stub**: Prepare endpoints for future Payment Gateway integration (Mada/Visa).
* [ ] **Transaction Records**: Keep track of payments and pending amounts.

---

## 📍 Hail Launch Focus (MVP Specifics)

* **Geofencing**: Prioritize providers located in **Hail** region in search results.
* **Localization**: Ensure all default text and currency (SAR) is tailored for the Saudi market.
* **Target Venues**: Focus on onboarding local wedding halls and "Al Ashqar Camp" style luxury events initially.

---

## 🚀 Tech Stack

* **Frontend**: Next.js 13+ (React), TypeScript, Tailwind CSS (optional but recommended).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Flexible for MVP catalog data) or PostgreSQL.
* **Hosting**: Vercel (Frontend), AWS/DigitalOcean (Backend).
