-- migrate:up
CREATE TABLE comments (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 comments VARCHAR(3000) NOT NULL,
 user_id INT NOT NULL,
 post_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
 FOREIGN KEY (user_id) REFERENCES users (id),
 FOREIGN KEY (post_id) REFERENCES posts (id)
);


-- migrate:down
DROP TABLE comments;

