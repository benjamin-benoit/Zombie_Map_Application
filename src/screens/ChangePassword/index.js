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

export default class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    static navigationOptions = {
        title: "Change password"
    };

    componentWillMount() {
        console.log({ user: this.props.navigation.getParam('user', 'defaultValue') })
        this.setState({ user: this.props.navigation.getParam('user', 'defaultValue') })
    }

    _changePassword = async () => {
        this.setState({ isLoggingIn: true, message: "" });
        var proceed = false;
        console.log(formBody);
        console.log(
            JSON.stringify({
                nickname: this.state.nickname,
                password: this.state.password
            })
        );
        fetch(Environment.CLIENT_API + "/api/user/changePassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.state.user.id,
                nickname: this.state.user.nickname,
                password: this.state.user.password,
                newPassword: this.state.user.newPassword,
                newPassword_confirmation: this.state.user.newPassword_confirmation
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
                            <Item inlineLabel>
                                <Input
                                    ref={component => (this._nickname = component)}
                                    placeholder="New password"
                                    onChangeText={nickname => this.setState({ nickname })}
                                    autoFocus={true}
                                    onFocus={this.clearNickname}
                                />
                            </Item>
                            <Item inlineLabel>
                                <Input
                                    ref={component => (this._password = component)}
                                    placeholder="New password confirmation"
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
                                onPress={this._changePassword()}
                            >
                                <Text>Update new password</Text>
                            </Button>
                        </ScrollView>
                    </Form>
                </Content>
            </Container>
        );
    }
}
