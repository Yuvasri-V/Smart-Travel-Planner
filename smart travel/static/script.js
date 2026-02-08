const exchangeRate = 83.0; // INR to USD approx.
// Hotel dataset (USD prices per night)
const hotels = [
  { name: "Hotel A", price: 80, rating: 4.5, tags: ["nature", "relaxation"] },
  { name: "Hotel B", price: 120, rating: 4.0, tags: ["culture", "food", "history"] },
  { name: "Hotel C", price: 60, rating: 3.8, tags: ["adventure", "budget"] },
  { name: "Hotel D", price: 100, rating: 4.2, tags: ["shopping", "food", "nightlife"] },
  { name: "Hotel E", price: 90, rating: 4.3, tags: ["wellness", "relaxation", "culture"] }
];

// Activity themes
const themes = {
  nature: ["Morning hike", "Botanical garden visit", "Sunset at scenic viewpoint"],
  culture: ["Local art galleries", "Traditional performances", "Heritage walk"],
  adventure: ["Zip-lining", "Kayaking", "Mountain biking"],
  food: ["Street food tour", "Cooking class", "Fine dining experience"],
  shopping: ["Local markets", "Designer boutiques", "Souvenir hunt"],
  relaxation: ["Spa day", "Beach lounging", "Slow café crawl"],
  nightlife: ["Pub crawl", "Rooftop bar", "Live music"],
  history: ["Museum tour", "Ancient ruins", "Guided historical walk"],
  wellness: ["Yoga retreat", "Meditation session", "Healthy brunch spots"]
};

// Weather fetch
async function getWeather(city) {
  const apiKey = "ba67311736eec43274aad18f773a75d0"; // <-- put your key here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod === 200) {
      return `${data.weather[0].description}, ${data.main.temp}°C`;
    } else {
      return "Weather not available";
    }
  } catch {
    return "Weather not available";
  }
}

document.getElementById("plannerForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const city = document.getElementById("city").value;
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const budgetINR = parseFloat(document.getElementById("budget").value);

  // Format budget with commas (₹1,23,456 style)
  const budgetINRFormatted = "₹" + budgetINR.toLocaleString("en-IN");
  const budgetUSD = (budgetINR / exchangeRate).toFixed(2);
  const preference = document.getElementById("preference").value;

  // Ensure at least 1 night if start = end
  let nights = (endDate - startDate) / (1000 * 60 * 60 * 24);
  nights = nights < 1 ? 1 : nights;

  // Weather
  const weather = await getWeather(city);

  // Filter hotels
  const filteredHotels = hotels.filter(h =>
    h.price * nights <= budgetUSD && h.tags.includes(preference)
  );

  // Build output
  let html = `
    <h3>✅ Travel Summary</h3>
    <p><b>Destination:</b> ${city} 🌆</p>
    <p><b>Dates:</b> ${startDate.toDateString()} → ${endDate.toDateString()} 📅</p>
    <p><b>Budget:</b> ${budgetINRFormatted} (≈ $${budgetUSD}) 💰</p>
    <p><b>Weather:</b> ${weather} ☀🌧</p>
  `;

  // Hotels
  if (filteredHotels.length > 0) {
    html += `
      <h4>🏨 Recommended Hotels</h4>
      <table>
        <tr><th>Hotel</th><th>Price/night ($)</th><th>Rating</th><th>Total Cost ($)</th><th>Tags</th></tr>
    `;
    filteredHotels.forEach(h => {
      html += `
        <tr>
          <td>${h.name}</td>
          <td>${h.price}</td>
          <td>${h.rating} ⭐</td>
          <td>${(h.price * nights).toFixed(2)}</td>
          <td>${h.tags.join(", ")}</td>
        </tr>
      `;
    });
    html += `</table>`;
  } else {
    html += `<p>⚠ No matching hotels found for your budget & preferences. 😞</p>`;
  }

  // Daily itinerary
  html += `<h4>📅 Suggested Daily Itinerary</h4><ul>`;
  const prefActivities = themes[preference] || ["General sightseeing"];
  for (let i = 0; i < nights; i++) {
    let activity = prefActivities[i % prefActivities.length];
    html += `<li>Day ${i+1}: ${activity} in ${city}</li>`;
  }
  html += `</ul>`;

  document.getElementById("output").innerHTML = html;
  document.getElementById("output").style.display = "block";
});
