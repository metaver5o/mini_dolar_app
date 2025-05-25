  ### Getting Started

1. Build and run the container:
     `` sh 
    docker-compose up --build
    ```

  2. Access the dashboard at [http://localhost:8080](http://localhost:8080)

  ### Running Locally

1. Navigate to the app directory:
    ```
cld app

 2. Install dependencies: 
    ```
    npm install
    ```

 3. Start the server:
    ```
    node server.js
    ```

  4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

  - ** API Key** : The application uses the Alpha Vantage API to fetch market data. Update the key in [server.js(app/server.js): 
    ```js
    const ALHPA_VANTAGE_KEY = "HK5KYXTX7W5BM0V52" // Replace with a valid key
    ```
</html>