module.exports = async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "✅ API working" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerId, title, message } = req.body;

  if (!playerId || !message) {
    return res.status(400).json({ error: 'Missing playerId or message' });
  }

  const APP_ID = "ac0d7a63-cacc-476b-bb9b-35ad9eab5ed7";
  const REST_API_KEY = "os_v2_app_vqgxuy6kzrdwxo43gwwz5k26246jyhzgjbye37fsmm7ocovegzaw6ja7oopvdbpvy4d66aof3zqypux2frd3tycs774vqyq7xwposfy"; // 👈 apni key daalo

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: APP_ID,
        include_subscription_ids: [playerId],
        headings: { en: title || "New Message" },
        contents: { en: message }
      })
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      onesignal_response: data
    });

  } catch (error) {
    console.error("Push Error:", error);
    return res.status(500).json({ error: 'Push failed' });
  }
};
