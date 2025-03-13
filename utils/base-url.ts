export const getBaseUrl = () => {
  // Check if the code is running in a browser (client-side)
  if (typeof window !== "undefined") {
    return "";
    // Returns an empty string, meaning relative URLs will be used.
    // This ensures that API requests automatically go to the same domain the app is hosted on,
    // whether it's running locally or on a production server.
    //  Returning "" in the browser makes the app use the current domain dynamically.
  }

  // Check if the code is running on Vercel (server-side in production)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
    // Constructs the full base URL using the environment variable set by Vercel.
    // Example: If deployed on Vercel, VERCEL_URL might be "myapp.vercel.app",
    // so the function returns "https://myapp.vercel.app".
  }

  // If none of the above conditions are met (e.g., running locally on the server)
  return `http://localhost:3000`;
  // This ensures the API requests are directed to the local server during development.
  // If removed, API requests may fail when running locally unless configured otherwise.
  // Since Next.js runs on both the client (browser) and the server, we need http://localhost:3000 for server-side requests during local development.
  // Unlike the browser, the server doesn't automatically assume the request should go to localhost:3000.
};
