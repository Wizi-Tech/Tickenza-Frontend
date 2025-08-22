export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const backendRes = await fetch("https://tickenza-app.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json();

    return new Response(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
