import React, { Component } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import {
  Container,
  Text,
  Button,
  Content,
  Form,
  Input,
  Item
} from "native-base";

export default class Register extends Component {

  static navigationOptions = {
    title: "Register"
  };
  
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      nickname: "",
      password: "",
      passwordConfirmation: ""
    };
  }

  login = async () => {
    const { navigate } = this.props.navigation;

    const response = await fetch(Environment.CLIENT_API + "/api/user/register", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        nickname: this.state.nickname,
        password: this.state.password,
        password_confimation: this.state.passwordConfirmation
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Content>
          <Form>
            <ScrollView style={{ padding: 20 }}>
              <Item inlineLabel>
                <Input
                  ref={component => (this.email = component)}
                  placeholder="Email"
                  onChangeText={email => this.setState({ email })}
                  autoFocus={true}
                  onFocus={this.clearEmail}
                />
              </Item>
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
              <Item inlineLabel>
                <Input
                  ref={component => (this._password = component)}
                  placeholder="Password confirmation"
                  onChangeText={passwordConfirmation =>
                    this.setState({ passwordConfirmation })
                  }
                  secureTextEntry={true}
                  onFocus={this.clearPasswordConfirmation}
                  onSubmitEditing={this._userLogin}
                />
              </Item>
              <Button
                block
                style={{
                  marginTop: 10
                }}
                disabled={
                  !this.state.nickname ||
                  !this.state.email ||
                  !this.state.password ||
                  !this.state.passwordConfirmation
                }
                onPress={() => navigate("Register", {})}
              >
                <Text>Register</Text>
              </Button>
            </ScrollView>
          </Form>
        </Content>
      </Container>
    );
  }
}
