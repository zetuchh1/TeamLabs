-- =============================================
-- SOSYAL MEDYA PLATFORMU - MySQL Veritabanı Şeması
-- =============================================

-- Veritabanı oluşturma
CREATE DATABASE IF NOT EXISTS sosyal_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sosyal_platform;

-- =============================================
-- KULLANICILAR TABLOSU
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires DATETIME,
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    is_private BOOLEAN DEFAULT FALSE,
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_email_verification_token (email_verification_token)
) ENGINE=InnoDB;

-- =============================================
-- OTURUMLAR TABLOSU (Sessions)
-- =============================================
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =============================================
-- TAKİP SİSTEMİ (Followers)
-- =============================================
CREATE TABLE follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    status ENUM('pending', 'accepted') DEFAULT 'accepted',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
) ENGINE=InnoDB;

-- =============================================
-- ENGELLEME SİSTEMİ (Blocks)
-- =============================================
CREATE TABLE blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blocker_id INT NOT NULL,
    blocked_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_block (blocker_id, blocked_id),
    INDEX idx_blocker (blocker_id),
    INDEX idx_blocked (blocked_id)
) ENGINE=InnoDB;

-- =============================================
-- GÖNDERILER TABLOSU (Posts - Ana sayfa formu)
-- =============================================
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    post_type ENUM('general', 'looking_for_friend') DEFAULT 'general',
    game_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================
-- GÖNDERİ FOTOĞRAFLARI
-- =============================================
CREATE TABLE post_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB;

-- =============================================
-- GÜNLÜK POST LİMİTİ TAKİBİ
-- =============================================
CREATE TABLE daily_post_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_date DATE NOT NULL,
    post_count INT DEFAULT 1,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, post_date),
    INDEX idx_user_date (user_id, post_date)
) ENGINE=InnoDB;

-- =============================================
-- SOHBETLER TABLOSU (Conversations)
-- =============================================
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- SOHBET KATILIMCILARI
-- =============================================
CREATE TABLE conversation_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    user_id INT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    last_read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (conversation_id, user_id),
    INDEX idx_user_conversations (user_id)
) ENGINE=InnoDB;

-- =============================================
-- MESAJLAR TABLOSU
-- =============================================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================
-- MESAJ FOTOĞRAFLARI (Mesaj başına max 4)
-- =============================================
CREATE TABLE message_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    INDEX idx_message_id (message_id)
) ENGINE=InnoDB;

-- =============================================
-- MESAJ İSTEKLERİ (Arkadaş olmayanlara gelen istekler)
-- =============================================
CREATE TABLE message_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    conversation_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_request (sender_id, receiver_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =============================================
-- BİLDİRİMLER TABLOSU
-- =============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('follow', 'message', 'message_request', 'post_like') NOT NULL,
    from_user_id INT,
    reference_id INT,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_notifications (user_id, is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================
-- FAYDALI GÖRÜNÜMLER (Views)
-- =============================================

-- Kullanıcı takipçi sayıları
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    (SELECT COUNT(*) FROM follows WHERE following_id = u.id AND status = 'accepted') as followers_count,
    (SELECT COUNT(*) FROM follows WHERE follower_id = u.id AND status = 'accepted') as following_count,
    (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND is_active = TRUE) as posts_count
FROM users u;

-- Okunmamış mesaj sayısı
CREATE VIEW unread_messages AS
SELECT 
    cp.user_id,
    COUNT(m.id) as unread_count
FROM conversation_participants cp
JOIN messages m ON m.conversation_id = cp.conversation_id
WHERE m.sender_id != cp.user_id
AND m.is_read = FALSE
AND cp.is_accepted = TRUE
GROUP BY cp.user_id;

-- Bekleyen mesaj istekleri sayısı
CREATE VIEW pending_message_requests AS
SELECT 
    receiver_id as user_id,
    COUNT(*) as request_count
FROM message_requests
WHERE status = 'pending'
GROUP BY receiver_id;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Günlük post limitini kontrol et (Günde max 3 post)
DELIMITER //
CREATE PROCEDURE check_daily_post_limit(IN p_user_id INT, OUT can_post BOOLEAN, OUT remaining INT)
BEGIN
    DECLARE current_count INT DEFAULT 0;
    DECLARE max_posts INT DEFAULT 3;
    
    SELECT COALESCE(post_count, 0) INTO current_count
    FROM daily_post_limits
    WHERE user_id = p_user_id AND post_date = CURDATE();
    
    IF current_count < max_posts THEN
        SET can_post = TRUE;
        SET remaining = max_posts - current_count;
    ELSE
        SET can_post = FALSE;
        SET remaining = 0;
    END IF;
END //
DELIMITER ;

-- Yeni gönderi eklerken limiti artır
DELIMITER //
CREATE PROCEDURE increment_daily_post_count(IN p_user_id INT)
BEGIN
    INSERT INTO daily_post_limits (user_id, post_date, post_count)
    VALUES (p_user_id, CURDATE(), 1)
    ON DUPLICATE KEY UPDATE post_count = post_count + 1;
END //
DELIMITER ;

-- Engel kontrolü
DELIMITER //
CREATE FUNCTION is_blocked(p_user_id INT, p_other_user_id INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE blocked_count INT;
    
    SELECT COUNT(*) INTO blocked_count
    FROM blocks
    WHERE (blocker_id = p_user_id AND blocked_id = p_other_user_id)
       OR (blocker_id = p_other_user_id AND blocked_id = p_user_id);
    
    RETURN blocked_count > 0;
END //
DELIMITER ;

-- Takip kontrolü (karşılıklı takip = arkadaş)
DELIMITER //
CREATE FUNCTION are_friends(p_user_id INT, p_other_user_id INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE follow_count INT;
    
    SELECT COUNT(*) INTO follow_count
    FROM follows f1
    JOIN follows f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id
    WHERE f1.follower_id = p_user_id AND f1.following_id = p_other_user_id
    AND f1.status = 'accepted' AND f2.status = 'accepted';
    
    RETURN follow_count > 0;
END //
DELIMITER ;

-- =============================================
-- ÖRNEK VERİLER (Test için)
-- =============================================

-- Test kullanıcıları (şifre: "password123" - bcrypt hash)
INSERT INTO users (username, email, password_hash, display_name, bio, email_verified) VALUES
('ahmet', 'ahmet@example.com', '$2b$10$example_hash_here', 'Ahmet Yılmaz', 'Oyun severim!', TRUE),
('ayse', 'ayse@example.com', '$2b$10$example_hash_here', 'Ayşe Demir', 'Valorant oynuyorum', TRUE),
('mehmet', 'mehmet@example.com', '$2b$10$example_hash_here', 'Mehmet Kaya', 'CS2 hayranı', TRUE);

-- =============================================
-- NOTLAR
-- =============================================
-- 1. password_hash alanı bcrypt ile hashlenmiş şifreleri saklar
-- 2. Mesaj başına maksimum 4 fotoğraf - uygulama katmanında kontrol edilmeli
-- 3. Günlük 3 post limiti - stored procedure ile kontrol
-- 4. Email doğrulama token'ları 24 saat geçerli
-- 5. Session token'ları 7 gün geçerli (ayarlanabilir)
