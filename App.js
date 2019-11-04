import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  StringeeClient,
  StringeeCall
} from 'stringee-react-native'

const FAKE_TOKEN = 'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS3BVbGZMUm1MRWMwak5MRGFKOTYwcU1rUVRlb1JlVFYtMTU2NTgzODI5NCIsImlzcyI6IlNLcFVsZkxSbUxFYzBqTkxEYUo5NjBxTWtRVGVvUmVUViIsImV4cCI6MTU2ODQzMDI5NCwidXNlcklkIjoibTExMSJ9.KmduLfg0XoP8brnFxn7EQZf-lfmed0gqpI5Ima4OpOM'

class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      stringeeConnected: false
    }
  }

  componentDidMount() {
    if (this.stringeeClient) {
      this.stringeeClient.connect(FAKE_TOKEN)
    }
  }

  // The client connects to Stringee server
  _clientDidConnect(userId) {
    console.log(1111111111, userId)
    this.setState({ stringeeConnected: true })
  }

  // The client disconnects from Stringee server
  _clientDidDisConnect() {
    console.log(2222222222)
    this.setState({ stringeeConnected: false })
  }

  // The client fails to connects to Stringee server
  _clientDidFailWithError(error) {
    console.log(3333333333, error)
  }

  // Access token is expired. A new access token is required to connect to Stringee server
  _clientRequestAccessToken(token) {
    console.log(4444444444, token)
  }

  // IncomingCall event
  _callIncomingCall({ callId, from, to, fromAlias, toAlias, callType, isVideoCall }) {
    console.log("IncomingCallId-" + callId + ' from-' + from + ' to-' + to + ' fromAlias-' + fromAlias + ' toAlias-' + toAlias + ' isVideoCall-' + isVideoCall + 'callType-' + callType)
  }

  // Invoked when the call signaling state changes
  _callDidChangeSignalingState({ callId, code, reason, sipCode, sipReason }) {
    console.log('callId-' + callId + 'code-' + code + ' reason-' + reason + ' sipCode-' + sipCode + ' sipReason-' + sipReason)
  }

  // Invoked when the call media state changes
  _callDidChangeMediaState({ callId, code, description }) {
    console.log('callId-' + callId + 'code-' + code + ' description-' + description)
  }

  // Invoked when the local stream is available
  _callDidReceiveLocalStream(callId) {
    console.log('_callDidReceiveLocalStream ' + callId)
  }

  // Invoked when the remote stream is available
  _callDidReceiveRemoteStream(callId) {
    console.log('_callDidReceiveRemoteStream ' + callId)
  }

  // Invoked when receives a DMTF
  _didReceiveDtmfDigit({ callId, dtmf }) {
    console.log('_didReceiveDtmfDigit ' + callId + "***" + dtmf)
  }

  // Invoked when receives info from other clients
  _didReceiveCallInfo({ callId, data }) {
    console.log('_didReceiveCallInfo ' + callId + "***" + data)
  }

  // Invoked when the call is handled on another device
  _didHandleOnAnotherDevice({ callId, code, description }) {
    console.log('_didHandleOnAnotherDevice ' + callId + "***" + code + "***" + description)
  }

  makeCall() {
    if (this.stringeeCall) {
      const options = {
        from: '84899199398',
        to: '84708111906',
        isVideoCall: false,
        videoResolution: 'NORMAL'
      }
      const params = JSON.stringify(options)

      this.stringeeCall.makeCall(params, (result) => {
        console.log(999999, result)
      })
    }
  }

  render() {
    const { stringeeConnected } = this.state

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <StringeeClient
          ref={ref => this.stringeeClient = ref}
          eventHandlers = {{
            onConnect: ({ userId }) => this._clientDidConnect(userId),
            onDisConnect: () => this._clientDidDisConnect(),
            onFailWithError: (error) => this._clientDidFailWithError(error),
            onRequestAccessToken: (token) => this._clientRequestAccessToken(token),
            onIncomingCall: (data) => this._callIncomingCall(data)
          }}
        />

        {
          stringeeConnected
          ? (
            <StringeeCall
              ref={ref => this.stringeeCall = ref}
              eventHandlers = {{
                onChangeSignalingState: (data) => this._callDidChangeSignalingState(data),
                onChangeMediaState: (data) => this._callDidChangeMediaState(data),
                onReceiveLocalStream:({ callId }) => this._callDidReceiveLocalStream(callId),
                onReceiveRemoteStream: ({ callId }) => this._callDidReceiveRemoteStream(callId),
                onReceiveDtmfDigit: (data) => this._didReceiveDtmfDigit(data),
                onReceiveCallInfo: (data) => this._didReceiveCallInfo(data),
                onHandleOnAnotherDevice: (data) => this._didHandleOnAnotherDevice(data)
              }}
            />
          )
          : null
        }
        <TouchableOpacity
          onPress={() => this.makeCall()}
        >
          <Text>Make a call</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default App