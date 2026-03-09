-- Create the database
CREATE DATABASE IF NOT EXISTS anime_db;
USE anime_db;

-- Create anime table
CREATE TABLE IF NOT EXISTS anime (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 10),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_anime (user_id, anime_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_favorite (user_id, anime_id)
);

-- Insert sample data
INSERT INTO anime (name) VALUES 
  ('Naruto'),
  ('One Piece'),
  ('Attack on Titan'),
  ('My Hero Academia'),
  ('Demon Slayer');

-- Insert characters for Naruto
INSERT INTO characters (name, anime_id) VALUES 
  ('Naruto Uzumaki', 1),
  ('Sasuke Uchiha', 1),
  ('Sakura Haruno', 1),
  ('Kakashi Hatake', 1),
  ('Hinata Hyuga', 1);

-- Insert characters for One Piece
INSERT INTO characters (name, anime_id) VALUES 
  ('Monkey D. Luffy', 2),
  ('Roronoa Zoro', 2),
  ('Nami', 2),
  ('Sanji', 2),
  ('Nico Robin', 2);

-- Insert characters for Attack on Titan
INSERT INTO characters (name, anime_id) VALUES 
  ('Eren Yeager', 3),
  ('Mikasa Ackerman', 3),
  ('Armin Arlert', 3),
  ('Levi Ackerman', 3),
  ('Erwin Smith', 3);

-- Insert characters for My Hero Academia
INSERT INTO characters (name, anime_id) VALUES 
  ('Izuku Midoriya', 4),
  ('Katsuki Bakugo', 4),
  ('Shoto Todoroki', 4),
  ('Ochaco Uraraka', 4),
  ('All Might', 4);

-- Insert characters for Demon Slayer
INSERT INTO characters (name, anime_id) VALUES 
  ('Tanjiro Kamado', 5),
  ('Nezuko Kamado', 5),
  ('Zenitsu Agatsuma', 5),
  ('Inosuke Hashibira', 5),
  ('Giyu Tomioka', 5);
