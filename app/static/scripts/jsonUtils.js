export async function fetchJson(url) {
  const response = await fetch(url, { method: 'GET' })
  if (!response) {
    throw new Error("Request had no response.")
  }
  else {
    const data = response.json();
    return data;
  }
}

export async function sendJson(url, content) {
    const response = await fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  if (!response) {
    console.error("Failed request.")
  }
}

