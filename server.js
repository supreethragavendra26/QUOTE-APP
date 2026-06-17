import http from "http";

// CRITICAL: Render overrides this with its own port environment variable
const PORT = process.env.PORT || 2000; 

const sample = {
  id: 0,
  quote: "Small steps every day. (Local Backup)",
  author: "System"
};

async function getJsonData(url) {
  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("External API request failed:", error.message);
    // CRITICAL FIX: Return your sample object if the API fails
    // This stops data2 from becoming 'undefined'
    return sample; 
  }
}

// Fetch global state object at script startup
const data2 = await getJsonData("https://dummyjson.com");

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  
  if (req.url === "/getquote" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    
    // Will safely stringify either the live data or your backup sample
    res.write(JSON.stringify(data2, null, 2));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
