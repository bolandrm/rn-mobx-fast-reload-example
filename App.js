import React, {useRef} from 'react';
import { Text, SafeAreaView } from 'react-native';
import {observer} from './mobx-react-lite/observer'
import {observable} from 'mobx'

const App = () => {
  const store = useRef(
    observable({
      name: 'Drew ',
    }),
  )

  return (
    <SafeAreaView>
      <Text>mobx test</Text>
    </SafeAreaView>
  );
};

export default observer(App);
