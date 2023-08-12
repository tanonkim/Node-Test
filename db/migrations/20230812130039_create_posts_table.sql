-- migrate:up
CREATE TABLE posts
(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(3000) NULL,
  image_url VARCHAR(1000) NULL,
  user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id) 
);


-- migrate:down
DROP TABLE posts;
