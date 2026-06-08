import { StyleSheet } from "react-native";

export const styles =StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"#F5F5F5",
        paddingTop:60,
    },

    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20,
    },

    title:{
        fontSize:28,
        fontWeight:"bold",
    },

    right:{
        flexDirection:"row",
    },

    icon:{
        fontSize:28,
        marginHorizontal:10,
    },

    locationRow:{
        marginHorizontal:20,
        marginBottom:10,
    },

    location:{
        fontSize:18,
        fontWeight:"600",
    },

    count:{
        color:"gray",
        marginTop:5,
    },
});