import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

interface Props{
  value:string;
  onChange:(text:string)=>void;
}

export default function SearchBar({
  value,
  onChange,
}:Props){

  return(
    <View style={styles.container}>
      <TextInput
        placeholder="🔍 レストランを検索"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles=StyleSheet.create({

  container:{
    marginHorizontal:15,
    marginTop:15,
    marginBottom:10,
  },

  input:{
    backgroundColor:"white",
    borderRadius:20,
    padding:15,
    fontSize:18,
  },

});