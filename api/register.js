import fetch from 'node-fetch';

export default async function handler(request, response) {
  try {
    const { email, firstname, lastname, password, phone, company } = request.body;

    // Fetch the access token
    const accessToken = await getAccessToken();
    if (!accessToken) return response.status(500).json({ error: "Failed to obtain access token" });

    // Check if this is the first user from this company
    const existingUsers = await getUsersByCompany(company, accessToken);
    const isFirstUser = existingUsers.length === 0;

    // Prepare custom attributes
    const customAttributes = {
      custom_ui_user: "TRUE",
      ...(isFirstUser && { org_root_user: "TRUE" })
    };

    // Create the user
    const userData = await createUser({ email, firstname, lastname, password, phone, company, customAttributes }, accessToken);
    if (!userData) return response.status(500).json({ error: "Failed to create user" });

    const userId = userData.id;

    // Register MFA: Email
    const mfaFactorData = await registerEmailMFA(userId, accessToken);
    if (!mfaFactorData) return response.status(500).json({ error: "Failed to register Email MFA factor" });

    await updateUserCustomAttribute(userId, {
      mfa_device_id_email: mfaFactorData.device_id,
    }, accessToken);

    // Register MFA: Email Magic Link
    const mfaFactorDataMagic = await registerEmail2MFA(userId, accessToken);
    if (!mfaFactorDataMagic) return response.status(500).json({ error: "Failed to register Email Magic Link MFA factor" });

    await updateUserCustomAttribute(userId, {
      mfa_device_id_email_mlink: mfaFactorDataMagic.device_id,
    }, accessToken);

    // Register MFA: Phone
    const mfaFactorDataPhone = await registerPhoneMFA(userId, accessToken);
    if (!mfaFactorDataPhone) return response.status(500).json({ error: "Failed to register Phone MFA factor" });

    // Respond
    return response.status(200).json({
      user: userData,
      mfa_email: mfaFactorData,
      mfa_email_magic: mfaFactorDataMagic,
      mfa_phone: mfaFactorDataPhone,
    });

  } catch (error) {
    console.error("Error in handler:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

// ------------------ Helper Functions ------------------

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

async function getUsersByCompany(companyName, accessToken) {
  try {
    const query = encodeURIComponent(companyName);
    const url = `${process.env.SERVER}/api/2/users?custom_attributes.cf_company=${query}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error("Failed to get users by company:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getUsersByCompany:", error);
    return [];
  }
}


async function createUser(userDetails, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/users?mappings=sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({
        email: userDetails.email,
        username: userDetails.phone,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        password: userDetails.password,
        password_confirmation: userDetails.password,
        phone: userDetails.phone,
        company: userDetails.company,
        custom_attributes: userDetails.customAttributes
      })
    });

    if (!response.ok) {
      console.error("Failed to create user:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createUser:", error);
    return null;
  }
}

async function updateUserCustomAttribute(userId, attributes, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/users/${userId}?mappings=sync`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({ custom_attributes: attributes })
    });

    if (!response.ok) {
      console.error("Failed to update user attributes:", response.statusText);
      return null;
    }

    return true;
  } catch (error) {
    console.error("Error in updateUserCustomAttribute:", error);
    return null;
  }
}

async function registerEmailMFA(userId, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/mfa/users/${userId}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({
        "factor_id": `${process.env.EMAIL_FACTOR_ID}`,
        "display_name": "Email",
        "verified": true
      })
    });

    if (!response.ok) {
      console.error("Failed to register email MFA factor:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in registerEmailMFA:", error);
    return null;
  }
}

async function registerEmail2MFA(userId, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/mfa/users/${userId}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({
        "factor_id": `${process.env.EMAIL2_FACTOR_ID}`,
        "display_name": "Email Magic Link",
        "verified": true
      })
    });

    if (!response.ok) {
      console.error("Failed to register email magic link MFA factor:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in registerEmail2MFA:", error);
    return null;
  }
}

async function registerPhoneMFA(userId, accessToken) {
  try {
    const response = await fetch(`${process.env.SERVER}/api/2/mfa/users/${userId}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({
        "factor_id": `${process.env.PHONE_FACTOR_ID}`,
        "display_name": "Phone",
        "verified": true
      })
    });

    if (!response.ok) {
      console.error("Failed to register phone MFA factor:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in registerPhoneMFA:", error);
    return null;
  }
}
