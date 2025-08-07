

import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import prisma from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}


[
  {
    "type": "step-start"
  },
  {
    "type": "tool-invocation",
    "toolInvocation": {
      "state": "result",
      "step": 0,
      "toolCallId": "call_JS6hi5yGMRaiHgLM415Mw9Iv",
      "toolName": "displayWeather",
      "args": {
        "location": "Bangalore"
      },
      "result": {
        "location": {
          "name": "Bangalore",
          "region": "Karnataka",
          "country": "India",
          "lat": 12.9833,
          "lon": 77.5833,
          "tz_id": "Asia/Kolkata",
          "localtime_epoch": 1754406427,
          "localtime": "2025-08-05 20:37"
        },
        "current": {
          "last_updated_epoch": 1754406000,
          "last_updated": "2025-08-05 20:30",
          "temp_c": 23.1,
          "temp_f": 73.6,
          "is_day": 0,
          "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/night/116.png",
            "code": 1003
          },
          "wind_mph": 4.9,
          "wind_kph": 7.9,
          "wind_degree": 157,
          "wind_dir": "SSE",
          "pressure_mb": 1012,
          "pressure_in": 29.88,
          "precip_mm": 1.17,
          "precip_in": 0.05,
          "humidity": 89,
          "cloud": 50,
          "feelslike_c": 25.1,
          "feelslike_f": 77.1,
          "windchill_c": 24.8,
          "windchill_f": 76.7,
          "heatindex_c": 26.5,
          "heatindex_f": 79.8,
          "dewpoint_c": 19.6,
          "dewpoint_f": 67.2,
          "vis_km": 6,
          "vis_miles": 3,
          "uv": 0,
          "gust_mph": 7.7,
          "gust_kph": 12.4
        }
      }
    }
  },
  {
    "type": "step-start"
  },
  {
    "type": "text",
    "text": "Sir, the current weather in Bangalore is partly cloudy with a temperature of approximately 23.1°C (73.6°F). The wind is blowing from the south-southeast at about 4.9 miles per hour. Humidity levels are high at 89%, and visibility is around 6 kilometers (3 miles). The atmospheric pressure is 1012 millibars."
  }
]

