import { Navigation } from "react-native-navigation"
import App from "./App"

console.disableYellowBox = true

Navigation.registerComponent(`navigation.playground.WelcomeScreen`, () => App)
Navigation.events().registerAppLaunchedListener(() => {
	Navigation.setRoot({
		root: {
			component: {
				name: "navigation.playground.WelcomeScreen"
			}
		}
	})
})
