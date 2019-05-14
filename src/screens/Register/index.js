import React, { Component } from "react";
import { ScrollView } from "react-native";
import {
  Container,
  Text,
  Button,
  Content,
  Form,
  Input,
  Item
} from "native-base";
import Environment from "../../../Environment";

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
      passwordConfirmation: "",
      message: ""
    };
  }

  register = async () => {
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
        password_confirmation: this.state.passwordConfirmation
      })
    });

    const json = await response.json();
    if (response.status === 400) {
      this.setState({ message: json.err });
    } else {
      console.log(json.data);
      this.setState({ id: json.data.user.id, isLoggingIn: true,score: json.data.user.score, lifePoints: json.data.user.lifePoints, attackPoints: json.data.user.attackPoints, weapon: {}  });
      navigate("Game", { user: this.state });
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
                  ref={component => (this._email = component)}
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
                  autoCapitalize = 'none'
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
              {!!this.state.message && (
                <Text style={{ fontSize: 14, color: "red", padding: 5 }}>
                  {this.state.message}
                </Text>
              )}
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
                onPress={this.register}
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
