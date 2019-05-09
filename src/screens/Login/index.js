import React, { Component } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import {
  Container,
  Button,
  Text,
  Content,
  Form,
  Input,
  Item
} from "native-base";
import Environment from "../../../Environment";

export default class Login extends Component {
  static navigationOptions = {
    title: "Login"
  };

  constructor(props) {
    super(props);

    this.state = {
      nickname: "",
      password: "",
      isLoggingIn: false,
      message: ""
    };
  }

  login = async () => {
    const { navigate } = this.props.navigation;

    const response = await fetch(Environment.CLIENT_API + "/api/user/login", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        nickname: this.state.nickname,
        password: this.state.password
      })
    });

    const json = await response.json();
    if (response.status === 400) {
      console.log(json.err);
    } else {
      console.log(json.data);
      navigate("Game", {});
      // this.props.connect(json.data.user, json.meta.token);
    }
  };

  _userLogin = () => {
    this.setState({ isLoggingIn: true, message: "" });

    // var params = {
    //     nickname: this.state.nickname,
    //     password: this.state.password,
    //     // grant_type: 'password'
    // };

    // var formBody = [];
    // for (var property in params) {
    //     var encodedKey = encodeURIComponent(property);
    //     var encodedValue = encodeURIComponent(params[property]);
    //     formBody.push(encodedKey + "=" + encodedValue);
    // }
    // formBody = formBody.join("&");

    var proceed = false;
    console.log(formBody);
    console.log(
      JSON.stringify({
        nickname: this.state.nickname,
        password: this.state.password
      })
    );
    fetch(Environment.CLIENT_API + "/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nickname: this.state.nickname,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == 201) proceed = true;
        else this.setState({ message: response.data });
        console.log(response.data);
      })
      .then(() => {
        this.setState({ isLoggingIn: false });
        if (proceed) this.props.onLoginPress();
      })
      .catch(err => {
        this.setState({ message: err.message });
        this.setState({ isLoggingIn: false });
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView style={{ padding: 20 }}>
              {/* <Text 
					style={{fontSize: 27}}>
					Login
				</Text> */}
              <Item inlineLabel>
                <Input
                  ref={component => (this._nickname = component)}
                  placeholder="Nickname"
                  onChangeText={nickname => this.setState({ nickname })}
                  autoFocus={true}
                  onFocus={this.clearNickname}
                />
              </Item>
              <Item inlineLabel>
                <Input
                  ref={component => (this._password = component)}
                  placeholder="Password"
                  onChangeText={password => this.setState({ password })}
                  secureTextEntry={true}
                  onFocus={this.clearPassword}
                  onSubmitEditing={this._userLogin}
                />
              </Item>
              {!!this.state.message && (
                <Text style={{ fontSize: 14, color: "red", padding: 5 }}>
                  {this.state.message}
                </Text>
              )}
              {this.state.isLoggingIn && <ActivityIndicator />}
              <View style={{ margin: 7 }} />
              <Button
                block
                disabled={
                  this.state.isLoggingIn ||
                  !this.state.nickname ||
                  !this.state.password
                }
                onPress={this.login}
              >
                <Text>Se connecter</Text>
              </Button>
              <Button
                bordered
                block
                style={{
                  marginTop: 10
                }}
                onPress={() => navigate("Register", {})}
              >
                <Text>Pas encore inscrit ?</Text>
              </Button>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
}
