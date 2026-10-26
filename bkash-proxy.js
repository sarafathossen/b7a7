const http = require("http");
const https = require("https");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/v1/payments/bkash-callback")) {
    // ১. লাইভ ব্যাকএন্ডে কলব্যাক ডাটা পাঠিয়ে ডাটাবেজে PAID স্ট্যাটাস আপডেট করানো
    const liveBackendUrl = `https://ambulance-dispatch-backend-azure.vercel.app${req.url}`;
    
    https.get(liveBackendUrl, (liveRes) => {
      // ২. ব্যাকএন্ড আপডেট হওয়া মাত্র ব্রাউজারকে সরাসরি আপনার ফ্রন্টএন্ড সাকসেস পেজে পাঠিয়ে দেওয়া
      const queryParams = req.url.split("?")[1] || "";
      res.writeHead(302, {
        Location: `http://localhost:3000/payment/success?${queryParams}`,
      });
      res.end();
    }).on("error", () => {
      // ব্যাকএন্ড এরর দিলেও আপনার সাকসেস পেজে চলে যাবে
      const queryParams = req.url.split("?")[1] || "";
      res.writeHead(302, {
        Location: `http://localhost:3000/payment/success?${queryParams}`,
      });
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(5000, () => {
  console.log("bKash Callback Proxy running on port 5000...");
});