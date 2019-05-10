import React, { Component } from "react";
import { Text, View, Alert } from "react-native";
import { MapView, Location, Permissions } from "expo";

export default class Game extends Component {
  static navigationOptions = {
    title: "Map"
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
      }
    };
  }

  _OnDragEnd = result => {
    this.setState({ locationResult: result.coordinate });
    console.log(this.state.locationResult);
    console.log(result.coordinate);
    if (result.coordinate == this.state.locationResult) {
      console.log("ok");
    } else {
      console.log("pas ok");
    }
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _handleMapRegionChange = region => {
    console.log(region);
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

  _onSpawnPress (markerData) {
    //if current lag / current long near from marker Data lat / marker Data long
    console.log(markerData);
    console.log(this.state.userLocation.latitude)
    console.log(this.state.userLocation.longitude)
    //FAIRE LES CALCULS
    alert(markerData.coordinate);
}

  // _onSpawnPress = async () => {
  //   Alert.alert(
  //     "Alert Title",
  //     "My Alert Msg",
  //     [
  //       {
  //         text: "Ask me later",
  //         onPress: () => console.log("Ask me later pressed")
  //       },
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "OK", onPress: () => console.log("OK Pressed") }
  //     ],
  //     { cancelable: false }
  //   );
  // };

  setUserLocation(coordinate){
    this.setState({
      userLocation: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      }
    })
  }

  mapStyle = require("./mapStyle.json");

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            height: 30,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 18,
            padding: 5
          }}
        >
          Score:{" "}
        </Text>
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
          {/* <MapView.Marker
              //image = '../../../assets/DarkSamus.png'
              coordinate={this.state.locationResult}
                title="My Marker"
                description="Some description"
                draggable
                onDragEnd={e => this._OnDragEnd(e.nativeEvent)}
                image={require('../../../assets/soldier-6.png')}
            /> */}
          {SPAWNS.map((m, i) => (
            <MapView.Marker
              coordinate={m.latLong}
              title={m.title}
              description={m.description}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/zombie-4.png")}
              onPress={(e) => {this._onSpawnPress(m)}}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const SPAWNS = [
  {
    key: "Zombie",
    title: "Zombie Level 1",
    description: "Kill him to get 1 point",
    latLong: {
      latitude: 48.78356518226211,
      longitude: 2.3951343385137105
    }
  },
  {
    key: "Zombie",
    title: "Zombie Level 1",
    description: "Kill him to get 1 point",
    latLong: {
      latitude: 48.869702,
      longitude: 2.335888
    }
  },
  {
    key: "Zombie",
    title: "Zombie Level 1",
    description: "Kill him to get 1 point",
    latLong: {
      latitude: 48.77993070617117,
      longitude: 2.3956984115292626
    }
  },
  {
    key: "Zombie",
    title: "Zombie Level 1",
    description: "Kill him to get 1 point",
    latLong: {
      latitude: 48.780455052145385,
      longitude: 2.4131448702847615
    }
  }
];
