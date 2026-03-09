// Script to add sample anime data to the database
const db = require('../config/db');
const animeData = require('../config/data');

async function addSampleData() {
  try {
    console.log('📝 Adding sample anime data from config/data.js...\n');

    let totalCharacters = 0;

    // Loop through each anime in the data
    for (const anime of animeData) {
      // Insert anime
      const [result] = await db.query('INSERT INTO anime (name) VALUES (?)', [anime.name]);
      const animeId = result.insertId;
      console.log(`✅ Added anime: ${anime.name} (ID: ${animeId})`);

      // Insert characters for this anime
      for (const character of anime.characters) {
        await db.query('INSERT INTO characters (name, anime_id) VALUES (?, ?)', [character.name, animeId]);
        totalCharacters++;
      }
      console.log(`   └─ Added ${anime.characters.length} characters\n`);
    }

    console.log(`✅ Added ${animeData.length} anime with ${totalCharacters} characters`);
    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📌 Try these commands:');
    console.log('  curl http://localhost:3000/api/anime');
    console.log('  curl http://localhost:3000/api/anime/1/characters');
    console.log('  curl "http://localhost:3000/api/search?q=naruto"');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  } finally {
    await db.end();
    process.exit(0);
  }
}

addSampleData();
