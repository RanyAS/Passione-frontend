import { Restaurant } from "../types/Restaurant";

export const restaurantData: Restaurant[]=[

    {
        id:"1",
        name:"らーめん横丁",
        genre:"ラーメン",
        emoji:"🍜",
        rating:4.2,
        distance:450,
        seats:4,
        oldPrice:890,
        newPrice:620,
        discount:30,
        timeLeft:"23分",
        open:true,
        favorite:false,
        color:"#FBE2BE"
    },

    {
    id:"2",
    name:"寿司 銀座",
    genre:"寿司",
    emoji:"🍣",
    rating:4.5,
    distance:650,
    seats:2,
    oldPrice:2800,
    newPrice:2100,
    discount:25,
    timeLeft:"45分",
    open:true,
    favorite:true,
    color:"#D8EAFF"
    },

    {
    id:"3",
    name:"イタリアントラットリア",
    genre:"イタリアン",
    emoji:"🍕",
    rating:4.3,
    distance:900,
    seats:6,
    oldPrice:1500,
    newPrice:1200,
    discount:20,
    timeLeft:"1時間",
    open:true,
    favorite:false,
    color:"#F7D8DD"
    },

    {
        id:"4",
        name:"焼肉 黒毛",
        genre:"焼肉",
        emoji:"🥩",
        rating:4.8,
        distance:1200,
        seats:5,
        oldPrice:3500,
        newPrice:2800,
        discount:20,
        timeLeft:"50分",
        open:true,
        favorite:false,
        color:"#F6E5D4"
    },

    {
        id:"5",
        name:"Cafe Sakura",
        genre:"カフェ",
        emoji:"☕",
        rating:4.4,
        distance:300,
        seats:8,
        oldPrice:1200,
        newPrice:900,
        discount:25,
        timeLeft:"35分",
        open:true,
        favorite:false,
        color:"#FCE7C8"
    }

];