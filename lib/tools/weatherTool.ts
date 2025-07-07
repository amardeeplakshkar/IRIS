import { WeatherClient } from '@agentic/weather'
import { tool } from 'ai'
import { z } from 'zod'
export const displayWeather = tool({
    description: 'Display the weather for a location',
    parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
    }),
    execute: async function ({ location }) {
        try {
            const cleanedLocation = location.trim().toLowerCase()
            const weather = new WeatherClient()
            const res = await weather.getCurrentWeather(cleanedLocation)

            if (!res || !res.current || !res.location) {
                return { error: 'Sorry, we don’t have weather data for that location.' }
            }

            return res;

        } catch (err: any) {
            const status = err?.response?.status || err?.status

            if (status === 400) {
                return {
                    error: `Sorry, we don’t have weather data for "${location}".`,
                }
            }

            return {
                error: `Something went wrong while fetching weather for "${location}". Please try again later.`,
            }
        }
    },
})