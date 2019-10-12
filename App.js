import React, {useState} from 'react';
import { Text, SafeAreaView } from 'react-native';
import { observer } from './mobx-react-lite/observer';

const App = (props) => {
  useState(null)

  return (
    <SafeAreaView>
      <Text>mobx test</Text>
    </SafeAreaView>
  );
};


export default observer(App);
