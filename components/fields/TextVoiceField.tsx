import React, { Component } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { MotiView } from "@motify/components";
import {
  StyleSheet,
  View,
  TouchableHighlight,
} from "react-native";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import { Easing } from "react-native-reanimated";
import { TextInput } from 'react-native-paper';

type FieldState = {
  label: string,
  value: string,

  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: boolean;
  results: string[];
  partialResults: string[];
};

interface IAclFormFieldProps {
  data: FieldState;
  options: object;
  change: () => void;
  onSpeechStart: () => void;
  onSpeechEnd: (result: any[]) => void;
}

const TextVoiceField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  // local state
  const [value, setValue] = React.useState('');
  const [label, setLabel] = React.useState('');
  // component specific state
  const [started, setStarted] = React.useState(false);
  const [recognized, setRecognized] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [error, setError] = React.useState('');
  const [pitch, setPitch] = React.useState(null);
  const [results, setResults] = React.useState(null);
  const [partialResults, setPartialResults] = React.useState(null);

  const state = {
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: false,
    results: [],
    partialResults: [],
  };

  const init = () => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
  }

  const componentWillUnmount = () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    setStarted(true);
  };
  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };
  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);
    setEnd("√");
    setStarted(false);

    //props.onSpeechEnd(this.state.results);
  };
  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e);
    setError(JSON.stringify(e.error));
  };
  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechResults: ", e);
    setResults(e.value!);
  };
  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechPartialResults: ", e);
    setPartialResults(e.value!);
  };
  const onSpeechVolumeChanged = (e: any) => {
    console.log("onSpeechVolumeChanged: ", e);
    setPitch(e.value);
  };

  const onChange = (text) => {
    setValue(text);
    props.change(text);
  }

  //core functions
  const resetState = () => {
    setRecognized("");
    setPitch("");
    setError("");
    setStarted(false);
    setResults([]);
    setPartialResults([]);
    setEnd("");
  }

  const _startRecognizing = async () => {
    resetState();
    try {
      await Voice.start("en-US");
      props.onSpeechStart();
    } catch (e) {
      console.error(e);
    }
  };
  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };
  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetState();
  };

  // initializer
  React.useEffect(() => {
    init();

    setLabel(props.data.label);
    setValue(props.data.value);
  }, [props]);

  return (
    <View style={styles.container}>
      {props.data.started ? (
        <TouchableHighlight onPress={_stopRecognizing}>
          <View
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              backgroundColor: "#6E01EF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[...Array(3).keys()].map((index) => {
              return (
                <MotiView
                  from={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 4 }}
                  transition={{
                    type: "timing",
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    delay: index * 200,
                    repeatReverse: false,
                    loop: true,
                  }}
                  key={index}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: "#6E01EF", borderRadius: 75 },
                  ]}
                />
              );
            })}
            <FontAwesome name="microphone-slash" size={24} color="#fff" />
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight onLongPress={_startRecognizing}>
          <View
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              backgroundColor: "#6E01EF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="microphone" size={24} color="#fff" />
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
  /*
  <TextInput style={[styles.padding, props.options.hide ? styles.hide : styles.show]}
    
      mode={props.options.mode ?? 'view'}
      name={props.data.name}
      label={props.data.label}
      placeholder={props.data.placeholder}
      dense={props.options.dense}
      multiline={props.options.multiline}
      numberOfLines={props.options.numberOfLines}
      left={props.options.left}
      right={props.options.right}
      disabled={props.options.disabled}
      error={props.options.error}
      secureTextEntry={props.options.secureTextEntry}
      selectionColor={props.options.selectionColor}
      cursorColor={props.options.cursorColor}
      underlineColor={props.options.underlineColor}
      activeUnderlineColor={props.options.activeUnderlineColor}
      outlineColor={props.options.outlineColor}
      textColor={props.options.textColor}
      activeOutlineColor={props.options.activeOutlineColor}

      value={value}

      onChangeText={text => onChange(text)}
    />
    */
};

export default TextVoiceField;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {},
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});