import React, { Component } from "react";
import { ScrollView, View, ActivityIndicator, StatusBar } from "react-native";
import {
    Container,
    Text,
    Content
} from "native-base";

export default class Login extends Component {
    static navigationOptions = {
        title: "Parameter"
    };


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <Container>
                    <Content>
                        <Text>TEST</Text>
                    </Content>
                </Container>
            </View>
        );
    }
}
