-- migrate:up
CREATE TABLE users 
(
  id INT NOT NULL AUTO_INCREMENT,                        
  name VARCHAR(50) NOT NULL,                             
  email VARCHAR(200) NOT NULL,
  profile_image VARCHAR(1000) NULL,    
  password VARCHAR(200) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)                                       
);

-- migrate:down
DROP TABLE users;
