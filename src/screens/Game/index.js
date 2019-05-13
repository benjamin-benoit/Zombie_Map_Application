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
      user: {}
        ,
      spawns: []
    };
  }

  componentWillMount() {
    this.setState({ user: this.props.navigation.getParam('user', 'defaultValue')})
  }

  componentDidMount() {
    this._getLocationAsync();
    const SPAWNS = this._getZombiesSpawns();
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

  _onSpawnPress = async (markerData, zombie) => {
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if (distance < 150) {//TODO remettre disrance à 100
      Alert.alert(
        "There is a Zombie !",
        "Do you want to fight him ?",
        [
          {
            text: "Run away",
            style: 'cancel',
          },
          {
            text: "Fight",
            // onPress: () => this._killZombie(spawnId),
            onPress: () => this._BattleZombie(zombie)
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
    //this.setState();
  }

  _BattleZombie(zombie){
    // console.log(typeof zombie.lifePoints)
    // console.log(typeof zombie.attackPoints)
    let current = Object.assign({}, this.state.user);
    console.log(current)
    let zombieLP = this._userAttacks(current.attackPoints,zombie.lifePoints)
    zombies[zombie.id-1].lifePoints = zombieLP
    if(zombieLP<=0){
      alert('You killed the zombie !')
      //this._killZombie(zombie.id)
      return 1;
    }
    let playerLP = this._zombieAttacks(current.lifePoints,zombie.attackPoints)
    current.lifePoints = playerLP;
    if(current.lifePoints<=0){
      alert('You are dead.')
    }
    else if(zombieLP>0){
      alert('You fought well but the zombie is still alive!')
    }
    this.setState({user:current})
    console.log(this.state.user)
  }

  _userAttacks(playerATK,zombieLP){
    console.log(Number(zombieLP) - Number(playerATK))
    return (Number(zombieLP) - Number(playerATK))
  }

  _zombieAttacks(playerLP,zombieATK){
    console.log(Number(playerLP) - Number(zombieATK))
    return (Number(playerLP) - Number(zombieATK))
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

    // this._getZombiesSpawns()
  }


  _onTake = async (markerData, gun) => {
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if (distance < 150) {//TODO remettre disrance à 100
      Alert.alert(
        "There is a gun !"
        [
          {
            text: "Leave it",
            style: 'cancel',
          },
          {
            text: "Take it",
            // onPress: () => this._killZombie(spawnId),
            onPress: () => this._AddBonus(gun)
          }
        ],
        { cancelable: true }
      );
    } else {
      alert("You're too far");
    }
  }

  _AddBonus(gun){
    let current = Object.assign({}, this.state.user);
    current.attackPoints =+ gun.bonus
    this.setState({user:current})
    alert(`You took the ${gun.title}! Go shoot some zombies now.`)
  }

  mapStyle = require("./mapStyle.json");

  render() {
    const { navigate } = this.props.navigation;
    // this._getZombiesSpawns()
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
            //onPress={() => navigate("Parameter", { user: this.state.user })}
            onPress={() => navigate("Parameter", {})}
          >Parameter</Text>
          <Text style={{ padding: 5, color: "#fff", fontSize: 18, paddingLeft: 10, textAlign: 'right' }}
          >
            Score:{this.state.user.score} Life:{this.state.user.lifePoints} Atk:{this.state.user.attackPoints}
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
          {/* {this.state.spawns.map((m, i) => ( */}
          {zombies.map((m, i) => ( 
            <MapView.Marker
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              id={m.id}
              title={m.title}
              description={`
              HP: ${m.lifePoints}
              ATK:${m.attackPoints}`}
              lifePoints= {m.lifePoints}
              attackPoints = {m.attackPoints}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/zombie-4.png")}
              onPress={(e) => { this._onSpawnPress(e.nativeEvent, m) }}
            />
          ))}
          {/* {weapons.map((m, i) => ( 
            <MapView.Marker
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              id={m.id}
              title={m.title}
              description={`Ammo: ${m.ammo}
              Power: ${m.bonus}`}
              bonus = {m.bonus}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/gun-4.png")}
              onPress={(e) => { this._onTake(e.nativeEvent, m) }}
            />
          ))} */}
        </MapView>
      </View>
    );
  }
}

const zombies = [
  {
    id: 1,
    latitude: 48.759395, 
    longitude: 2.403832,
    title:'Zombie 1',
    description:'Zombie',
    lifePoints: 2,
    attackPoints :1}
  ,
  {
    id: 2,
    latitude: 48.759897,  
    longitude: 2.402743,
    title:'Zombie 2',
    description:'Strong Zombie',
    lifePoints: 3,
    attackPoints : 2
  }
]

const weapons = [
  {id: 1,
    latitude: 48.759935, 
    longitude: 2.401252,
    title:'Assault Rifle',
    description:'Weapon',
    bonus:1,
    ammo: 10
  },
  {
    id: 2,
    latitude: 48.758931,  
    longitude: 2.401080,
    title:'Scar-L',
    description:'Weapon',
    bonus : 2,
    ammo: 5
  }
]

const packs = [

]