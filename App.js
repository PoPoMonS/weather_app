import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "cad5c3f091c5899f7b02e2365b359bea";

const icons = {
	Clouds: "cloudy",
	Clear: "day-sunny",
	Rain: "rains",
	Snow: "snow",
	Drizzle: "rain",
	Thunderstrom: "lightning",
	Atmosphere: "cloudy-gusts",
};

export default function App() {
	const [city, setCity] = useState();
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();

		if (!granted) {
			setOk(false);
		}

		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync(
			{ latitude, longitude },
			{ useGoogleMaps: false }
		);
		setCity(location[0].city);

		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
		);
		const { daily } = await response.json();
		setDays(daily);
	};

	useEffect(() => {
		getWeather();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				horizontal
				contentContainerStyle={styles.weather}
			>
				{days.length === 0 ? (
					<View style={styles.day}>
						<ActivityIndicator
							color="black"
							size="large"
							style={{ marginTop: 10 }}
						></ActivityIndicator>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={styles.day}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									width: "100%",
									justifyContent: "space-between",
								}}
							>
								<Text style={styles.temperature}>
									{parseFloat(day.temp.day).toFixed(1)}
								</Text>
								<Fontisto
									name={icons[day.weather[0].main]}
									size={60}
									color="ivory"
								/>
							</View>
							<Text style={styles.description}>{day.weather[0].main}</Text>
							<Text style={styles.tinyText}>{day.weather[0].description}</Text>
						</View>
					))
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "gold",
	},
	city: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		color: "ivory",
		fontSize: 68,
		fontWeight: "600",
	},
	weather: {},
	day: {
		marginLeft: 30,
		marginRight: 30,
		width: SCREEN_WIDTH - 60,
	},
	temperature: {
		color: "ivory",
		fontWeight: "600",
		marginTop: 50,
		fontSize: 100,
	},
	description: {
		color: "ivory",
		fontSize: 30,
	},
	tinyText: {
		color: "ivory",
		fontSize: 20,
	},
});
