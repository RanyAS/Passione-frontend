const IP_ADDRESS = "10.109.0.104";    // 自分のIPアドレスに変更
const BASE_URL = `http://${IP_ADDRESS}:3000`;

export async function getGenre() {
    const res = await fetch(`${BASE_URL}/api/genres`);

    if(!res.ok){
        throw new Error("ジャンルの取得に失敗しました。");
    }
    
    return await res.json();
}