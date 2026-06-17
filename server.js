import http from "http";
const PORT = process.env.PORT || 2001; 


async function getJsonData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch JSON:", error);
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/getquote" && req.method === "GET") {
    try {
      const data = await getJsonData("https://dummyjson.com/quotes/random");

      if (!data) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Failed to fetch quote" }));
      }

      const cleanPayload = {
        quote: data.quote,
        author: data.author,
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cleanPayload));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Server error" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
