import React,{useState} from "react";
import{
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
}from"react-native";
import SearchBar from "../components/SearchBar";
import RestaurantCard from "../components/RestaurantCard";
import FilterBottomSheet from "../components/FilterBottomSheet";
import {restaurantData} from "../data/restaurantData";
import {Restaurant} from "../types/Restaurant"; 
// import FloatingMapButton from "../components/FloatingMapButton"; TODO: 実装後にインポートする
import { styles } from "../styles/SearchResultStyle";

export default function SearchResultScreen(){
    const [search,setSearch]=useState("");
    const [selectedGenre,setSelectedGenre]=useState("すべて");
    const [showFilter,setShowFilter]=useState(false);
    const [restaurants,setRestaurants]=

    useState<Restaurant[]>(restaurantData);

    const filteredRestaurants= restaurants.filter(item=>{
        const matchSearch= item.name.toLowerCase().includes(search.toLowerCase());
        const matchGenre= selectedGenre==="すべて" || item.genre===selectedGenre;

         return matchSearch&&matchGenre;
    });

    const toggleFavorite=(id:string)=>{
        setRestaurants(prev=> prev.map(item => item.id===id ?
                {
                ...item,
                favorite:!item.favorite,
                } : item
            )
        );
    };

    return(

    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity>
              <Text style={styles.icon}> ← </Text>
            </TouchableOpacity>
            <Text style={styles.title}> 近くのお得情報 </Text>
            <View style={styles.right}>
                <TouchableOpacity>
                    <Text style={styles.icon}> 🗺️ </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>setShowFilter(true)}
                >
                    <Text style={styles.icon}> ☰ </Text>
                </TouchableOpacity>
            </View>
        </View>
        <SearchBar
            value={search}
            onChange={setSearch}
        />
        <View style={styles.locationRow}>
            <Text style={styles.location}>📍大阪駅周辺</Text>
            <Text style={styles.count}>{filteredRestaurants.length}件の結果</Text>
        </View>
        <FlatList
            data={filteredRestaurants}
            keyExtractor={item=>item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item})=>(
            <RestaurantCard
            item={item}
            onPress={()=>{
                console.log(item.name);
            }}
            onFavorite={()=>{
                toggleFavorite(item.id);
            }}
            />
        )}
        />

        {/* TODO: FloatingMapButtonを実装して、地図画面に遷移できるようにする */}
        {/* <FloatingMapButton
            onPress={()=>{
                console.log("Map");
            }}
        /> */}

        <FilterBottomSheet
            visible={showFilter}
            selected={selectedGenre}
            onClose={()=>setShowFilter(false)}
            onSelect={(genre)=>{
                setSelectedGenre(genre);
            }}
        />
        </View>
    );
}