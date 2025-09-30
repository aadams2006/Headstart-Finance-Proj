# Headstart-Finance-Proj

# Opulus Financial Workspace

## Overview

This repository powers the full Opulus journey—from the public marketing presence to the authenticated personal finance workspace. Visitors start on the refreshed landing page, create an account, and then unlock a private dashboard containing the interactive tools.

## Project Structure

- `index.html` – Marketing site that highlights the platform and links to the secure sign-in flow.
- `login.html` & `login.js` – Client-side authentication flow for creating accounts and managing sessions using local storage.
- `dashboard.html` – Authenticated workspace that hosts the expense tracker, savings goal planner, and contextual guidance.
- `dashboard.css` – Shared styling for the dashboard layout and components.
- `expenses.js` – User-scoped expense tracker with sorting, summaries, and persistence per account.
- `calculator.js` – Savings goal timeline calculator with friendly messaging and stored scenarios.

## Running Locally

No build step is required. Open `index.html` in a browser and navigate through the sign-in experience. Account details and dashboard data are stored only in your browser via local storage for demonstration purposes.


