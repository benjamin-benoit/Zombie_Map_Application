import React, { Component } from "react";
import { Text, View, StatusBar, Alert, TouchableOpacity, Image } from "react-native";
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
    this.setState({ user: this.props.navigation.getParam('user', 'defaultValue') })
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
    console.log(json.data.user)
    json.data.user.weapon = this.state.user.weapon
    this.setState({ user: json.data.user})//TODO
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

  _isAlive(){
    if(this.state.user.lifePoints>0){
      return true;
    }
    else{
      alert(`You're dead`)
      return false
    }
  }

  _onSpawnPress = async (markerData, zombie) => {
    let range = 100;
    if(this._isAlive()){
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if(this.state.user.weapon != null){
     range = this.state.user.weapon.range
    }
    if (distance < range) {//TODO remettre disrance à 100
      Alert.alert(
        'There is a Zombie !',
        'Do you want to fight him ?',
        [
          {
            text: 'Run away',
            style: 'cancel',
          },
          {
            text: 'Fight',
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
  }


  _killZombie(spawnId) {
    this._changeScore(1)
    this._addReach(spawnId)
    //this.setState(); reload render
  }

  _BattleZombie(zombie) {
    let bonus = (this.state.user.weapon.bonus) ? this.state.user.weapon.bonus : 0
    let damage = parseInt(this.state.user.attackPoints) + parseInt(bonus)
    let current = Object.assign({}, this.state.user);
    let zombieLP = this._userAttacks(damage, zombie.lifePoints)
    for (var i = 0; i < zombies.length; i++) {
      if (zombies[i].id == zombie.id) {
        zombies[i].lifePoints = zombieLP
      }
    }
    if (zombieLP <= 0) {
      alert('You killed the zombie !')
      //this._killZombie(zombie.id)
      for (var i = 0; i < zombies.length; i++) {
        if (zombies[i].id == zombie.id) {
          zombies.splice(i, 1);  //removes 1 element at position i
        }
      }
      for (var i = 0; i < zombies.length; i++) {
        console.log(zombies[i])
      }
      this._changeScore(1)
      return 1;
    }
    let playerLP = this._zombieAttacks(current.lifePoints, zombie.attackPoints)
    this._setUserHealth(current.id,playerLP)
   // current.lifePoints = playerLP;
    if (playerLP <= 0) {
      alert('You are dead.')
    }
    else if (zombieLP > 0) {
      alert('You fought well but the zombie is still alive!')
    }
    this.setState({ user: current })
    console.log(this.state.user)
  }

  _setUserHealth = async (id,lifePoints)=>{
    const { navigate } = this.props.navigation;

    const response = await fetch(Environment.CLIENT_API + "/api/user/changeLifePoints", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        id,
        lifePoints
      })
    });

    const json = await response.json();
    if (response.status === 400) {
      this.setState({ message: json.err });
    } else {
      this.setState({ id: json.data.user.id, isLoggingIn: true, score: json.data.user.score, lifePoints: json.data.user.lifePoints, attackPoints: json.data.user.attackPoints, weapon: this.state.user.weapon });
    }
  };

  _userAttacks(playerATK, zombieLP) {
    console.log(Number(zombieLP) - Number(playerATK))
    return (Number(zombieLP) - Number(playerATK))
  }

  _zombieAttacks(playerLP, zombieATK) {
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


  _onTakeGun = async (markerData, gun) => {
    if(this._isAlive()){
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if (distance < 200) {//TODO remettre disrance à 100
      Alert.alert(
        'There is a gun !',
        'It looks powerful !',
        [
          {
            text: 'Leave it',
            style: 'cancel',
          },
          {
            text: 'Take it',
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
  }

  _AddBonus(gun) {
    let current = Object.assign({}, this.state.user);
    current.weapon = gun
    alert(`You took the ${gun.title}! Go shoot some zombies now.`)
    for (var i = 0; i < weapons.length; i++) {
      if (weapons[i].id == gun.id) {
        weapons.splice(i, 1);  //removes 1 element at position i 
        break;
      }
    }
    this.setState({ user: current })
  }

  _onHeal = async (markerData, pack) => {
    var spawnLatLong = markerData.coordinate;
    var distance = geolib.getDistance(
      spawnLatLong,
      { latitude: this.state.userLocation.latitude, longitude: this.state.userLocation.longitude }
    );
    if (distance < 150) {//TODO remettre disrance à 100
      Alert.alert(
        'There is a health pack !',
        'You can gain some HP with it!',
        [
          {
            text: 'Leave it',
            style: 'cancel',
          },
          {
            text: 'Take it',
            // onPress: () => this._killZombie(spawnId),
            onPress: () => this._AddHealth(pack)
          }
        ],
        { cancelable: true }
      );
    } else {
      alert("You're too far");
    }
  }

  _AddHealth(pack) {
    let current = Object.assign({}, this.state.user);
    current.lifePoints = current.lifePoints + pack.heal
    alert(`You took a ${pack.title}! Go back to fight now !`)
    for (var i = 0; i < packs.length; i++) {
      if (packs[i].id == pack.id) {
        packs.splice(i, 1);  //removes 1 element at position i 
        break;
      }
    }
    this.setState({ user: current })
  }

  mapStyle = require("./mapStyle.json");

  render() {
    const { navigate } = this.props.navigation;
    let bonus = (this.state.user.weapon.bonus) ? this.state.user.weapon.bonus : 0
    let damage = parseInt(this.state.user.attackPoints) + parseInt(bonus)
    let _hasWeapon = !Object.keys(this.state.user.weapon).length
    //(this.state.user.weapon) ? this.setState({})
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <MapView
          showsUserLocation
          followsUserLocation
          style={{
            flex: 1
          }}
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
              description={`HP: ${m.lifePoints} 
ATK:${m.attackPoints}`}
              lifePoints={m.lifePoints}
              attackPoints={m.attackPoints}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/zombie-4.png")}
              onPress={(e) => { this._onSpawnPress(e.nativeEvent, m) }}
            />
          ))}
          {weapons.map((m, i) => (
            <MapView.Marker
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              id={m.id}
              title={m.title}
              description={`Ammo: ${m.ammo}
Power: ${m.bonus}`}
              bonus={m.bonus}
              range={m.range}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/gun-4.png")}
              onPress={(e) => { this._onTakeGun(e.nativeEvent, m) }}
            />
          ))}
          {packs.map((m, i) => (
            <MapView.Marker
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              id={m.id}
              title={m.title}
              description={`Heal: ${m.heal}`}
              heal={m.heal}
              key={`marker-${i}`}
              pinColor="#20794C"
              image={require("../../../assets/first-aid-kit.png")}
              onPress={(e) => { this._onHeal(e.nativeEvent, m) }}
            />
          ))}
        </MapView>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 30,
          left: 0,
          right: 0,
          top: 0,
          position: 'absolute'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'column'
          }}>
            <View>
              <Text style={{ padding: 10, color: "#fff", fontSize: 18, paddingLeft: 10 }}
              >
                Score: {this.state.user.score}
              </Text>
            </View>
            <View style={{  flexDirection: 'row' }}
            >
              {/* <Image style={{ padding: 5, paddingLeft: 10 }}
                source={(_hasWeapon) ? require("../../../assets/cardiogram-2.png"):  require("../../../assets/gun-4.png")} /> */}
              <Text style={{padding: 10, color: "#fff", fontSize: 18, paddingLeft: 10 }}
              >
                Atk :{damage}
              </Text>
            </View>
            <View style={{ padding: 5, paddingLeft: 10, flexDirection: 'row' }}
            >
              <Image style={{ padding: 5, paddingLeft: 10 }}
                source={require("../../../assets/cardiogram-2.png")} />
              <Text style={{ padding: 5, color: "#fff", fontSize: 18, paddingLeft: 10 }}
              >
                x{this.state.user.lifePoints}
              </Text>
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <TouchableOpacity activeOpacity = { .5 } onPress={() => navigate("Parameter", { user: this.state.user })}>
              <Image
                source={require("../../../assets/settings-2.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const zombies = [
  {
    id: 1,
    latitude: 48.789960,
    longitude: 2.363237,
    title: 'Zombie 1',
    description: 'Zombie',
    lifePoints: 50,
    attackPoints: 15
  }
  ,
  {
    id: 2,
    latitude: 48.789840,
    longitude: 2.362186,
    title: 'Zombie 2',
    description: 'Strong Zombie',
    lifePoints: 80,
    attackPoints: 20
  }
]

const weapons = [
  {
    id: 1,
    latitude: 48.789225,
    longitude: 2.362004,
    title: 'Assault Rifle',
    description: 'Weapon',
    bonus: 30,
    //ammo: 10,
    range:400
  },
  {
    id: 2,
    latitude: 48.758931,
    longitude: 2.362176,
    title: 'Scar-L',
    description: 'Weapon',
    bonus: 50,
    //ammo: 5,
    range:500
  }
]

const packs = [
  {
    id: 1,
    latitude: 48.788419,
    longitude: 2.363292,
    title: 'Tiny health pack',
    description: 'Health pack',
    heal: 50,
  },
  {
    id: 2,
    latitude: 48.788638,
    longitude: 2.363882,
    title: 'Big Health pack',
    description: 'Health pack',
    heal: 100,
  }
]