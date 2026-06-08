import React from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
} from "react-native";
import { Restaurant } from "../types/Restaurant";

interface Props{
    item:Restaurant;
    onPress:()=>void;
    onFavorite:()=>void;
}

export default function RestaurantCard({
    item,
    onPress,
    onFavorite,
}:Props){

    return(

        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
        >

        <View
            style={[
            styles.image,
            {backgroundColor:item.color},
            ]}
        >
            <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
                <View style={styles.info}>
                <View style={styles.topRow}>
                <Text style={styles.name}>{item.name}</Text>
            <View style={styles.discount}>
                <Text style={styles.discountText}>
                -{item.discount}%
                </Text>
            </View>
        </View>
        <Text>⭐ {item.rating}</Text>
        <Text>📍 {item.distance}m</Text>
        <Text>{item.open ? "🟢営業中":"🔴営業終了"}</Text>
        <Text>空席 {item.seats}席</Text>
        <View style={styles.priceRow}>
            <Text style={styles.oldPrice}>¥{item.oldPrice}</Text>
            <Text style={styles.newPrice}>¥{item.newPrice}</Text>
        </View>
        <Text>🕒 あと{item.timeLeft}</Text>
        <TouchableOpacity
          onPress={onFavorite}
        >
          <Text style={styles.favorite}>{item.favorite?"❤️":"🤍"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
}

const styles=StyleSheet.create({

    card:{
        backgroundColor:"white",
        marginHorizontal:15,
        marginBottom:15,
        borderRadius:20,
        flexDirection:"row",
        overflow:"hidden",
        elevation:3,
    },

    image:{
        width:110,
        justifyContent:"center",
        alignItems:"center",
    },

    emoji:{
        fontSize:60,
    },

    info:{
        flex:1,
        padding:15,
    },

    topRow:{
        flexDirection:"row",
        justifyContent:"space-between",
    },

    name:{
        fontSize:20,
        fontWeight:"bold",
    },

    discount:{
        backgroundColor:"#FF5A4E",
        paddingHorizontal:8,
        borderRadius:15,
        justifyContent:"center",
    },

    discountText:{
        color:"white",
        fontWeight:"bold",
    },

    priceRow:{
        flexDirection:"row",
        alignItems:"center",
    },

    oldPrice:{
        textDecorationLine:"line-through",
        marginRight:10,
        color:"gray",
    },

    newPrice:{
        fontSize:22,
        fontWeight:"bold",
        color:"#FF5A4E",
    },

    favorite:{
        fontSize:30,
        marginTop:5,
    },
});