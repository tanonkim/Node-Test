-- migrate:up
CREATE TABLE `PostImage`
(
    `id`             BIGINT NOT NULL AUTO_INCREMENT,
    `post_id`        INT NOT NULL,
    `user_id`        INT NOT NULL,
    `post_image_url` TEXT   NULL,
    PRIMARY KEY (id),
    foreign key (post_id) references posts(id),
    foreign key (user_id) references users(id)
);

ALTER TABLE posts DROP image_url;



-- migrate:down
DROP TABLE PostImage;
