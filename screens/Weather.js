import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar, Card } from "react-native-paper";

const Weather = () => {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=2c42db8054ea43ed881162428231811&q=${city}&days=6`
      );
      if (!response.ok) {
        setError("Failed to fetch weather data. Please try again later.");
        return;
      }
      const data = await response.json();
      setCityName(data.location.name);
      setCountryName(data.location.country);
      setForecastData(data.forecast.forecastday);
    } catch (error) {
      setError("Error fetching weather data. Please try again later.");
      console.error("Error fetching weather data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Weather Forecast</Text>
      <TextInput
        style={styles.input}
        label="Enter City Name"
        value={city}
        onChangeText={setCity}
      />
      <Button style={styles.button} mode="contained" onPress={fetchWeatherData}>
        Fetch Weather
      </Button>
      {forecastData.length > 0 && (
        <View style={styles.forecastContainer}>
          {forecastData.map((day, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.date}>{day.date}</Text>
                <Text style={styles.location}>
                  {cityName}, {countryName}
                </Text>
                <Text>{day.day.condition.text}</Text>
                <Text>Max Temp: {day.day.maxtemp_c}°C</Text>
                <Text>Min Temp: {day.day.mintemp_c}°C</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
      <Snackbar
        visible={error !== null}
        onDismiss={() => setError(null)}
        duration={Snackbar.DURATION_SHORT}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: "100%",
  },
  button: {
    marginTop: 10,
    width: "100%",
  },
  forecastContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  card: {
    width: "48%",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default Weather;
