import sql from "better-sqlite3";
import { cache } from "react";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

// cache 훅 적용 후, 터미널에 'Fetching messages from db'이 두개 -> 하나만 뜸
export const getMessages = cache(function getMessages() {
  console.log("Fetching messages from db");
  return db.prepare("SELECT * FROM messages").all();
});
