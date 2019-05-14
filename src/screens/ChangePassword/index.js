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
            newPassword: "",
            newPassword_confirmation: "",
            user: {}
        };
    }

    static navigationOptions = {
        title: "Change Password"
    };

    componentWillMount() {
        this.setState({ user: this.props.navigation.getParam('user', 'defaultValue') })
    }

    _changePassword = async () => {
        fetch(Environment.CLIENT_API + "/api/user/changePassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.state.user.id,
                nickname: this.state.user.nickname,
                password: this.state.user.password,
                newPassword: this.state.newPassword,
                newPassword_confirmation: this.state.newPassword_confirmation
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.status == 201) proceed = true;
                else this.setState({ message: response.data });
                console.log(response.data);
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
                                    placeholder="New password"
                                    onChangeText={newPassword => this.setState({ newPassword })}
                                    autoFocus={true}
                                    autoCapitalize = 'none'
                                    onFocus={this.clearNewPassword}
                                />
                            </Item>
                            <Item inlineLabel>
                                <Input
                                    placeholder="New password confirmation"
                                    onChangeText={newPassword_confirmation => this.setState({ newPassword_confirmation })}
                                    onFocus={this.clearNewPassword_confirmation}
                                    autoCapitalize = 'none'
                                    onSubmitEditing={this._userLogin}
                                />
                            </Item>
                            <View style={{ margin: 7 }} />
                            <Button
                                block
                                disabled={
                                    !this.state.newPassword ||
                                    !this.state.newPassword_confirmation
                                }
                                onPress={() => this._changePassword()}
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
