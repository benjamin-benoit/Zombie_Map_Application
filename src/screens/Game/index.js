import React, { Component } from "react";
import { Text, View, StatusBar, Alert } from "react-native";
import { MapView, Location, Permissions } from "expo";
import geolib from 'geolib';
import Environment from "../../../Environment";

export default class Game extends Component {

  static navigationOptions = {
    title: "Map",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      locationResult: { latitude: 0, longitude: 0 },
      errorMessage: null,
      hasLocationPermissions: false,
      region: null,
      location: null,
      userLocation: {
        latitude: null,
        longitude: null,
        latitudeDelta: null,
        longitudeDelta: null
      },
      user: {},
      spawns: []
    };
  }


  _changeScore = async (score) => {
    const response = await fetch(Environment.CLIENT_API + "/api/user/addScore", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        id: this.state.user.id,
        score
      })
    });

    const json = await response.json();
    this.setState({ user: json.data.user })
  }

  _addReach = async (spawnId) => {
    console.log(spawnId)
    console.log(this.state.user.id)
    const response = await fetch(Environment.CLIENT_API + "/api/reach/create", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        userId: this.state.user.id,
        spawnId: spawnId
      })
    });
  }

  _getZombiesSpawns = async () => {
    const response = await fetch(Environment.CLIENT_API + "/api/spawn/getReach/" + this.state.user.id, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET"
    });

    const json = await response.json();
    this.setState({ spawns: json.data.spawns });
  };

  componentWillMount() {
    this.setState({ user: this.props.navigation.getParam('user', 'defaultValue') })
  }

  componentDidMount() {
    this._getLocationAsync();
    const SPAWNS = this._getZombiesSpawns();
  }

  _handleMapRegionChange = region => {
    this.setState({ region });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922 / 10,
        longitudeDelta: 0.0421 / 10
      },
      locationResult: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      location
    });
  };

  _onSpawnPress = async (markerData, spawnId) => {
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if (distance < 100) {
      Alert.alert(
        "There is a Zombie !",
        "Do you want to kill him ?",
        [
          {
            text: "Run away",
            style: 'cancel',
          },
          {
            text: "Kill him",
            onPress: () => this._killZombie(spawnId),
          }
        ],
        { cancelable: true }
      );
    } else {
      alert("You're too far");
    }
  }

  _killZombie(spawnId) {
    this._changeScore(1)
    this._addReach(spawnId)
    this.setState();
  }

  setUserLocation(coordinate) {
    this.setState({
      userLocation: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      }
    })

    this._getZombiesSpawns()
  }

  mapStyle = require("./mapStyle.json");

  render() {
    const { navigate } = this.props.navigation;
    this._getZombiesSpawns()
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <View style={{
          flexDirection: 'row', height: 30,
          backgroundColor: "#000"
        }}>

          <Text style={{
            backgroundColor: "#fff", padding: 5, color: "#000", fontSize: 18
          }}
            onPress={() => navigate("Parameter", {})}
          >Parameter</Text>
          <Text style={{ padding: 5, color: "#fff", fontSize: 18, paddingLeft: 10, textAlign: 'right' }}
          >
            Score:{this.state.user.score}
          </Text>
        </View>
        <MapView
          showsUserLocation
          followsUserLocation
          style={{ flex: 1 }}
          region={this.state.region}
          zoomEnabled={false}
          pitchEnabled={false}
          scrollEnabled={false}
          customMapStyle={this.mapStyle}
          provider={MapView.PROVIDER_GOOGLE}
          rotateEnabled={false}
          showsCompass={true}
          onUserLocationChange={locationChangedResult => this.setUserLocation(locationChangedResult.nativeEvent.coordinate)}
        >
          {this.state.spawns.map((m, i) => (
            <MapView.Marker
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={m.title}
              description={m.description}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/zombie-4.png")}
              onPress={(e) => { this._onSpawnPress(e.nativeEvent, m.id) }}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
