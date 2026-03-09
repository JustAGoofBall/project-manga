// Anime data with characters organized by anime
// NOTE: IDs are NOT included - the database automatically generates unique IDs!
// This prevents duplicate ID errors when adding new anime/characters.
const animeData = [
  {
    name: "Naruto",
    characters: [
      { name: "Naruto Uzumaki" },
      { name: "Sasuke Uchiha" },
      { name: "Sakura Haruno" },
      { name: "Kakashi Hatake" },
      { name: "Hinata Hyuga" }
    ]
  },
  {
    name: "One Piece",
    characters: [
      { name: "Monkey D. Luffy" },
      { name: "Roronoa Zoro" },
      { name: "Nami" },
      { name: "Sanji" },
      { name: "Nico Robin" }
    ]
  },
  {
    name: "Attack on Titan",
    characters: [
      { name: "Eren Yeager" },
      { name: "Mikasa Ackerman" },
      { name: "Armin Arlert" },
      { name: "Levi Ackerman" },
      { name: "Erwin Smith" }
    ]
  },
  {
    name: "My Hero Academia",
    characters: [
      { name: "Izuku Midoriya" },
      { name: "Katsuki Bakugo" },
      { name: "Shoto Todoroki" },
      { name: "Ochaco Uraraka" },
      { name: "All Might" }
    ]
  },
  {
    name: "Demon Slayer",
    characters: [
      { name: "Tanjiro Kamado" },
      { name: "Nezuko Kamado" },
      { name: "Zenitsu Agatsuma" },
      { name: "Inosuke Hashibira" },
      { name: "Giyu Tomioka" },
      { name: "Kyojuro Rengoku" },
      { name: "Shinobu Kocho" },
      { name: "Muzan Kibutsuji" },
      { name: "Akaza" },
      { name: "Daki" },
      { name: "Gyutaro" },
      { name: "Tengen Uzui" },
      { name: "Kanao Tsuyuri" },
      { name: "Genya Shinazugawa" },
      { name: "Muichiro Tokito" },
      { name: "Gyomei Himejima" },
      { name: "Sanemi Shinazugawa" },
      { name: "Obanai Iguro" },
      { name: "Mitsuri Kanroji" },
      { name: "Rui" }
    ]
  },
  {
    name: "Dragon Ball Z",
    characters: [
      { name: "Goku" },
      { name: "Vegeta" },
      { name: "Gohan" },
      { name: "Piccolo" },
      { name: "Trunks" },
      { name: "Frieza" },
      { name: "Cell" },
      { name: "Majin Buu" },
      { name: "Beerus" },
      { name: "Whis" },
      { name: "Broly" },
      { name: "Goku Black" },
      { name: "Zamasu" },
      { name: "Jiren" },
      { name: "Hit" }
    ]
  },
  {
    name: "Death Note",
    characters: [
      { name: "Light Yagami" },
      { name: "L" },
      { name: "Misa Amane" },
      { name: "Ryuk" },
      { name: "Near" }
    ]
  },
  {
    name: "Fullmetal Alchemist",
    characters: [
      { name: "Edward Elric" },
      { name: "Alphonse Elric" },
      { name: "Roy Mustang" },
      { name: "Winry Rockbell" },
      { name: "Riza Hawkeye" }
    ]
  },
  {
    name: "Hunter x Hunter",
    characters: [
      { name: "Gon Freecss" },
      { name: "Killua Zoldyck" },
      { name: "Kurapika" },
      { name: "Leorio" },
      { name: "Hisoka" }
    ]
  },
  {
    name: "Sword Art Online",
    characters: [
      { name: "Kirito" },
      { name: "Asuna" },
      { name: "Sinon" },
      { name: "Klein" },
      { name: "Yui" }
    ]
  }
];

module.exports = animeData;
