import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from './src/screens/Login'
import Secured from './src/screens/Secured'
import Game from './src/screens/Game'
import Register from './src/screens/Register'
import Parameter from './src/screens/Parameter'
import ChangePassword from './src/screens/ChangePassword'

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
  },
  Register: {
    screen: Register,
  },
  Secured: {
    screen: Secured,
  },
  Game: {
    screen: Game,
  },
  Parameter: {
    screen: Parameter,
  },
  ChangePassword: {
    screen: ChangePassword,
  }
}, {
    initialRouteName: 'Login',
  });

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;