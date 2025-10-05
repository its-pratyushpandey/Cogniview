import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return NextResponse.json({ 
        location,
        temperature: "22°C",
        description: "Clear sky",
        humidity: "65%",
        note: "Demo data - add OPENWEATHER_API_KEY for real data"
      });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Weather data not found" }, { status: 404 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      location: data.name,
      temperature: `${Math.round(data.main.temp)}°C`,
      description: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      windSpeed: `${data.wind.speed} m/s`
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}