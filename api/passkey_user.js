import fetch from 'node-fetch';

export default async function handler(request, response) {
  try {
    // Fetch the access token
    const accessToken = await getAccessToken();

    // If accessToken is null, return an error response
    if (!accessToken) {
      return response.status(500).json({ error: "Failed to obtain access token" });
    }

    // Extract the email from the query parameters
    const userEmail = request.query.email;

    // If email is not present, return an error response
    if (!userEmail) {
      return response.status(400).json({ error: "Email is required" });
    }

    // Get user data using the obtained access token and email
    const userData = await getUser(userEmail, accessToken);

    // If userData is null, return an error response
    if (!userData) {
      return response.status(404).json({ error: "User not found" });
    }

    // Return success response with user data
    return response.status(200).json({ user: userData, exists: true });

  } catch (error) {
    // Handle unexpected errors
    console.error("Error in handler:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to get access token
async function getAccessToken() {
  try {
    const response = await fetch(`${process.env.SERVER}/auth/oauth2/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify({ grant_type: "client_credentials" })
    });

    if (!response.ok) {
      console.error("Failed to obtain access token:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error in getAccessToken:", error);
    return null;
  }
}

// Helper function to get a user by email
async function getUser(userEmail, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/users?email=${encodeURIComponent(userEmail)}&custom_attributes.passkey_user=TRUE&fields=custom_attributes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error("Failed to get user:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data; // This contains the user's information
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
}
