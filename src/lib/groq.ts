import Groq from "groq-sdk";

const getBaseApiUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://ais-pre-g6ovcjpa5brrp24z2pzcxc-843202541187.europe-west2.run.app";
  }
  return "";
};

// Client-side helper that calls our backend proxy to avoid exposing the API key
export async function getGroqResponse(prompt: string): Promise<string> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("هذه الخدمة تتطلب اتصالاً بالإنترنت");
  }

  try {
    const baseUrl = getBaseApiUrl();
    const response = await fetch(`${baseUrl}/api/groq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch Groq response');
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Groq Client Error:", error);
    throw error;
  }
}
