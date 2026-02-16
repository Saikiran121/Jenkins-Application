# Deep Sea Explorer (Node.js)

A themed Express.js application designed to demonstrate Jenkins CI/CD patterns for Node.js projects. It features a premium "Abyss Visualizer" Web UI.

## 🚀 Prerequisites

- **Node.js**: Version 14 or higher.
- **npm**: Standard Node package manager.

## 🛠️ Local Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Application**:
    ```bash
    npm start
    ```
    The server will start at `http://localhost:3000`.

3.  **View the Visualizer**:
    Open your browser and navigate to `http://localhost:3000` to see the **Abyss Visualizer** Web UI.

## 🧪 Testing & Quality

1.  **Run Unit Tests**:
    ```bash
    npm test
    ```
    This uses **Mocha** and **Chai** to verify API endpoints. It also generates a `test-results.xml` file for CI reporting.

2.  **Check Code Coverage**:
    ```bash
    npm run coverage
    ```
    This uses **NYC** to calculate test coverage. You can find the detailed HTML report in the `coverage/` directory after running this command.

## 📎 Project Structure

- `app.js`: Main Express application and REST endpoints.
- `app-test.js`: Comprehensive unit tests.
- `Jenkinsfile`: Automated CI/CD pipeline configuration.
- `public/`: Premium Web UI static assets.
- `package.json`: Project dependencies and automation scripts.
