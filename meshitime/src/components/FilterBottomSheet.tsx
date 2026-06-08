import React from "react";
import{
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
}from"react-native";

const genres=[
    "すべて",
    "ラーメン",
    "寿司",
    "焼肉",
    "イタリアン",
    "カフェ",
];

interface Props{
    visible:boolean;
    selected:string;
    onClose:()=>void;
    onSelect:(genre:string)=>void;
}

export default function FilterBottomSheet({
    visible,
    selected,
    onClose,
    onSelect,
}:Props){

return(

    <Modal
        visible={visible}
        transparent
        animationType="slide"
    >
        <View style={styles.overlay}>
            <View style={styles.sheet}>
                <Text style={styles.title}>ジャンル</Text>
                {
                    genres.map((genre)=>(
                        <TouchableOpacity
                            key={genre}
                            style={styles.item}
                            onPress={()=>{
                    onSelect(genre);
                    onClose();
                }}
                    >
                    <Text
                        style={{
                        fontSize:18,
                        fontWeight:selected===genre?"bold":"normal",
                    }}
                    >{genre}</Text>
                </TouchableOpacity>

                ))
                }
                <TouchableOpacity
                onPress={onClose}
                >
                    <Text style={styles.close}>閉じる</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    ); 
}

const styles=StyleSheet.create({

    overlay:{
        flex:1,
        justifyContent:"flex-end",
        backgroundColor:"rgba(0,0,0,0.4)",
    },

    sheet:{
        backgroundColor:"white",
        padding:20,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
    },

    title:{
        fontSize:22,
        fontWeight:"bold",
        marginBottom:15,
    },

    item:{
        paddingVertical:15,
    },

    close:{
        textAlign:"center",
        marginTop:10,
        color:"red",
        fontSize:18,
    },
});