-- migrate:up
ALTER TABLE comments
ADD CONSTRAINT FK_comments_post_id
FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- migrate:down
DROP TABLE comments;

