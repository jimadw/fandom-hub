// src/api/lotrApi.js

// Kalo einai na valeis to key sto .env sou san VITE_LOTR_API_KEY h REACT_APP_LOTR_API_KEY
// gia thn wra mporeis na to kaneis paste apeutheias edw gia na to testareis.
const API_KEY = 'K_3tHFbxm3oYqNfcurfn'; 
const BASE_URL = 'https://the-one-api.dev/v2';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Travaei tous xaraktires kai ftiaxnei ena leksiko { id: "Name" }
export const fetchCharacters = async () => {
  try {
    const response = await fetch(`${BASE_URL}/character`, { headers });
    const data = await response.json();
    
    const charMap = {};
    const charList = []; // Krataw kai ti lista gia na pairnoume tyxaious lathos xaraktires
    
    data.docs.forEach(char => {
      charMap[char._id] = char.name;
      charList.push(char);
    });
    
    return { charMap, charList };
  } catch (error) {
    console.error("Error fetching characters:", error);
    return null;
  }
};

// Travaei tyxaies atakes
export const fetchQuotes = async () => {
  try {
    // To API kleinei ta panta se pages, pairnoume 100 atakes gia na exoume poikilia
    const response = await fetch(`${BASE_URL}/quote?limit=100`, { headers });
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return null;
  }
};