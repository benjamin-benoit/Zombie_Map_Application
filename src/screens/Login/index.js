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
      id: "",
      nickname: "",
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
      this.setState({ message: json.err });
    } else {
      this.setState({ id: json.data.user.id, isLoggingIn: true, score: json.data.user.score, lifePoints: json.data.user.lifePoints, attackPoints: json.data.user.attackPoints, weapon: {} });
      navigate("Game", { user: this.state });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView style={{ padding: 20 }}>
              <Item inlineLabel>
                <Input
                  ref={component => (this._nickname = component)}
                  placeholder="Nickname"
                  onChangeText={nickname => this.setState({ nickname })}
                  autoFocus={true}
                  autoCapitalize='none'
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
                <Text>Login</Text>
              </Button>
              <Button
                bordered
                block
                style={{
                  marginTop: 10
                }}
                onPress={() => navigate("Register", {})}
              >
                <Text>Not registered yet ?</Text>
              </Button>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
}
