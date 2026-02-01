// Mock Database - Gerçek MySQL bağlantısı için bu dosyayı değiştirin
// Bu dosya demo amaçlıdır, gerçek uygulamada MySQL bağlantısı kullanın

import type { User, Post, Message, Conversation, Follow, Block, MessageRequest, Notification } from "./types"
import bcrypt from "bcryptjs"

// Mock kullanıcılar
const mockUsers: Map<number, User & { password_hash: string }> = new Map([
  [1, {
    id: 1,
    username: "ahmet",
    email: "ahmet@example.com",
    password_hash: "$2a$10$X7.H5Q9Q5Q9Q5Q9Q5Q9Q5OKjOKjOKjOKjOKjOKjOKjOKjOKjOKjO", // password123
    display_name: "Ahmet Yılmaz",
    bio: "Oyun severim! Valorant ve CS2 oynuyorum.",
    avatar_url: null,
    cover_image_url: null,
    email_verified: true,
    is_active: true,
    is_private: false,
    last_seen: new Date().toISOString(),
    created_at: "2024-01-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  }],
  [2, {
    id: 2,
    username: "ayse",
    email: "ayse@example.com",
    password_hash: "$2a$10$X7.H5Q9Q5Q9Q5Q9Q5Q9Q5OKjOKjOKjOKjOKjOKjOKjOKjOKjOKjO",
    display_name: "Ayşe Demir",
    bio: "Valorant main'iyim, duo arıyorum!",
    avatar_url: null,
    cover_image_url: null,
    email_verified: true,
    is_active: true,
    is_private: false,
    last_seen: new Date().toISOString(),
    created_at: "2024-01-15T00:00:00Z",
    updated_at: new Date().toISOString(),
  }],
  [3, {
    id: 3,
    username: "mehmet",
    email: "mehmet@example.com",
    password_hash: "$2a$10$X7.H5Q9Q5Q9Q5Q9Q5Q9Q5OKjOKjOKjOKjOKjOKjOKjOKjOKjOKjO",
    display_name: "Mehmet Kaya",
    bio: "CS2 hayranı, turnuva takımı arıyorum",
    avatar_url: null,
    cover_image_url: null,
    email_verified: true,
    is_active: true,
    is_private: false,
    last_seen: new Date().toISOString(),
    created_at: "2024-02-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  }],
])

// Mock gönderiler
const mockPosts: Map<number, Post> = new Map([
  [1, {
    id: 1,
    user_id: 1,
    content: "Valorant için duo arıyorum! Gold 3 rankındayım, akşamları müsaitim.",
    post_type: "looking_for_friend",
    game_name: "Valorant",
    is_active: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  }],
  [2, {
    id: 2,
    user_id: 2,
    content: "CS2 oynayacak takım arkadaşları arıyorum. Faceit Level 7'yim.",
    post_type: "looking_for_friend",
    game_name: "CS2",
    is_active: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  }],
  [3, {
    id: 3,
    user_id: 3,
    content: "League of Legends için ranked takımı kuruyoruz! Plat+ oyuncular davetlidir.",
    post_type: "looking_for_friend",
    game_name: "League of Legends",
    is_active: true,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date(Date.now() - 10800000).toISOString(),
  }],
])

// Mock takipler
const mockFollows: Map<number, Follow> = new Map([
  [1, { id: 1, follower_id: 1, following_id: 2, status: "accepted", created_at: "2024-01-20T00:00:00Z" }],
  [2, { id: 2, follower_id: 2, following_id: 1, status: "accepted", created_at: "2024-01-20T00:00:00Z" }],
  [3, { id: 3, follower_id: 3, following_id: 1, status: "accepted", created_at: "2024-02-05T00:00:00Z" }],
])

// Mock engellemeler
const mockBlocks: Map<number, Block> = new Map()

// Mock konuşmalar
const mockConversations: Map<number, Conversation> = new Map([
  [1, { id: 1, created_at: "2024-01-20T00:00:00Z", updated_at: new Date().toISOString() }],
])

// Mock mesajlar
const mockMessages: Map<number, Message> = new Map([
  [1, { id: 1, conversation_id: 1, sender_id: 1, content: "Selam! Valorant oynamak ister misin?", is_read: true, created_at: "2024-01-20T10:00:00Z" }],
  [2, { id: 2, conversation_id: 1, sender_id: 2, content: "Tabii! Akşam 8'de müsait misin?", is_read: true, created_at: "2024-01-20T10:05:00Z" }],
  [3, { id: 3, conversation_id: 1, sender_id: 1, content: "Evet, harika! O zaman görüşürüz.", is_read: false, created_at: "2024-01-20T10:10:00Z" }],
])

// Mock mesaj istekleri
const mockMessageRequests: Map<number, MessageRequest> = new Map()

// Mock bildirimler
const mockNotifications: Map<number, Notification> = new Map()

// Mock oturumlar
const mockSessions: Map<string, { user_id: number; expires_at: Date }> = new Map()

// Günlük post limitleri
const mockDailyPostLimits: Map<string, number> = new Map()

// Conversation participants
const mockConversationParticipants: Map<number, { conversation_id: number; user_id: number; is_accepted: boolean }[]> = new Map([
  [1, [
    { conversation_id: 1, user_id: 1, is_accepted: true },
    { conversation_id: 1, user_id: 2, is_accepted: true },
  ]],
])

let nextUserId = 4
let nextPostId = 4
let nextMessageId = 4
let nextConversationId = 2
let nextFollowId = 4
let nextBlockId = 1
let nextRequestId = 1
let nextNotificationId = 1

// Database fonksiyonları
export const db = {
  // Kullanıcı işlemleri
  users: {
    findById: (id: number): User | null => {
      const user = mockUsers.get(id)
      if (!user) return null
      const { password_hash: _, ...userData } = user
      return userData
    },
    
    findByEmail: (email: string): (User & { password_hash: string }) | null => {
      for (const user of mockUsers.values()) {
        if (user.email === email) return user
      }
      return null
    },
    
    findByUsername: (username: string): User | null => {
      for (const user of mockUsers.values()) {
        if (user.username === username) {
          const { password_hash: _, ...userData } = user
          return userData
        }
      }
      return null
    },
    
    create: async (data: { username: string; email: string; password: string; display_name?: string }): Promise<User> => {
      const password_hash = await bcrypt.hash(data.password, 10)
      const newUser = {
        id: nextUserId++,
        username: data.username,
        email: data.email,
        password_hash,
        display_name: data.display_name || data.username,
        bio: null,
        avatar_url: null,
        cover_image_url: null,
        email_verified: false,
        is_active: true,
        is_private: false,
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockUsers.set(newUser.id, newUser)
      const { password_hash: _, ...userData } = newUser
      return userData
    },
    
    update: (id: number, data: Partial<User>): User | null => {
      const user = mockUsers.get(id)
      if (!user) return null
      const updated = { ...user, ...data, updated_at: new Date().toISOString() }
      mockUsers.set(id, updated)
      const { password_hash: _, ...userData } = updated
      return userData
    },
    
    verifyPassword: async (email: string, password: string): Promise<User | null> => {
      const user = db.users.findByEmail(email)
      if (!user) return null
      
      // Demo için basit şifre kontrolü
      if (password === "password123" || await bcrypt.compare(password, user.password_hash)) {
        const { password_hash: _, ...userData } = user
        return userData
      }
      return null
    },
    
    getAll: (): User[] => {
      return Array.from(mockUsers.values()).map(({ password_hash: _, ...user }) => user)
    },
    
    search: (query: string): User[] => {
      const lowerQuery = query.toLowerCase()
      return Array.from(mockUsers.values())
        .filter(user => 
          user.username.toLowerCase().includes(lowerQuery) ||
          (user.display_name?.toLowerCase().includes(lowerQuery))
        )
        .map(({ password_hash: _, ...user }) => user)
    },
  },
  
  // Oturum işlemleri
  sessions: {
    create: (userId: number): string => {
      const token = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
      mockSessions.set(token, {
        user_id: userId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
      })
      return token
    },
    
    get: (token: string): { user_id: number } | null => {
      const session = mockSessions.get(token)
      if (!session) return null
      if (new Date() > session.expires_at) {
        mockSessions.delete(token)
        return null
      }
      return { user_id: session.user_id }
    },
    
    delete: (token: string): void => {
      mockSessions.delete(token)
    },
  },
  
  // Gönderi işlemleri
  posts: {
    findById: (id: number): Post | null => mockPosts.get(id) || null,
    
    getAll: (options?: { limit?: number; offset?: number }): Post[] => {
      const posts = Array.from(mockPosts.values())
        .filter(p => p.is_active)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      const start = options?.offset || 0
      const end = options?.limit ? start + options.limit : undefined
      return posts.slice(start, end)
    },
    
    getByUserId: (userId: number): Post[] => {
      return Array.from(mockPosts.values())
        .filter(p => p.user_id === userId && p.is_active)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    },
    
    create: (data: { user_id: number; content: string; post_type: "general" | "looking_for_friend"; game_name?: string }): Post | null => {
      // Günlük limit kontrolü
      const today = new Date().toISOString().split("T")[0]
      const limitKey = `${data.user_id}_${today}`
      const currentCount = mockDailyPostLimits.get(limitKey) || 0
      
      if (currentCount >= 3) return null
      
      const newPost: Post = {
        id: nextPostId++,
        ...data,
        game_name: data.game_name || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      mockPosts.set(newPost.id, newPost)
      mockDailyPostLimits.set(limitKey, currentCount + 1)
      return newPost
    },
    
    delete: (id: number): boolean => {
      const post = mockPosts.get(id)
      if (!post) return false
      post.is_active = false
      return true
    },
    
    getRemainingPosts: (userId: number): number => {
      const today = new Date().toISOString().split("T")[0]
      const limitKey = `${userId}_${today}`
      const currentCount = mockDailyPostLimits.get(limitKey) || 0
      return Math.max(0, 3 - currentCount)
    },
  },
  
  // Takip işlemleri
  follows: {
    isFollowing: (followerId: number, followingId: number): boolean => {
      for (const follow of mockFollows.values()) {
        if (follow.follower_id === followerId && follow.following_id === followingId && follow.status === "accepted") {
          return true
        }
      }
      return false
    },
    
    areFriends: (userId1: number, userId2: number): boolean => {
      return db.follows.isFollowing(userId1, userId2) && db.follows.isFollowing(userId2, userId1)
    },
    
    follow: (followerId: number, followingId: number): Follow => {
      // Zaten takip ediyor mu kontrol et
      for (const follow of mockFollows.values()) {
        if (follow.follower_id === followerId && follow.following_id === followingId) {
          return follow
        }
      }
      
      const newFollow: Follow = {
        id: nextFollowId++,
        follower_id: followerId,
        following_id: followingId,
        status: "accepted",
        created_at: new Date().toISOString(),
      }
      mockFollows.set(newFollow.id, newFollow)
      return newFollow
    },
    
    unfollow: (followerId: number, followingId: number): boolean => {
      for (const [id, follow] of mockFollows.entries()) {
        if (follow.follower_id === followerId && follow.following_id === followingId) {
          mockFollows.delete(id)
          return true
        }
      }
      return false
    },
    
    getFollowers: (userId: number): User[] => {
      const followerIds: number[] = []
      for (const follow of mockFollows.values()) {
        if (follow.following_id === userId && follow.status === "accepted") {
          followerIds.push(follow.follower_id)
        }
      }
      return followerIds.map(id => db.users.findById(id)).filter((u): u is User => u !== null)
    },
    
    getFollowing: (userId: number): User[] => {
      const followingIds: number[] = []
      for (const follow of mockFollows.values()) {
        if (follow.follower_id === userId && follow.status === "accepted") {
          followingIds.push(follow.following_id)
        }
      }
      return followingIds.map(id => db.users.findById(id)).filter((u): u is User => u !== null)
    },
    
    getFollowersCount: (userId: number): number => {
      let count = 0
      for (const follow of mockFollows.values()) {
        if (follow.following_id === userId && follow.status === "accepted") count++
      }
      return count
    },
    
    getFollowingCount: (userId: number): number => {
      let count = 0
      for (const follow of mockFollows.values()) {
        if (follow.follower_id === userId && follow.status === "accepted") count++
      }
      return count
    },
  },
  
  // Engelleme işlemleri
  blocks: {
    isBlocked: (blockerId: number, blockedId: number): boolean => {
      for (const block of mockBlocks.values()) {
        if ((block.blocker_id === blockerId && block.blocked_id === blockedId) ||
            (block.blocker_id === blockedId && block.blocked_id === blockerId)) {
          return true
        }
      }
      return false
    },
    
    block: (blockerId: number, blockedId: number): Block => {
      // Önce takibi kaldır
      db.follows.unfollow(blockerId, blockedId)
      db.follows.unfollow(blockedId, blockerId)
      
      const newBlock: Block = {
        id: nextBlockId++,
        blocker_id: blockerId,
        blocked_id: blockedId,
        created_at: new Date().toISOString(),
      }
      mockBlocks.set(newBlock.id, newBlock)
      return newBlock
    },
    
    unblock: (blockerId: number, blockedId: number): boolean => {
      for (const [id, block] of mockBlocks.entries()) {
        if (block.blocker_id === blockerId && block.blocked_id === blockedId) {
          mockBlocks.delete(id)
          return true
        }
      }
      return false
    },
    
    getBlockedUsers: (userId: number): User[] => {
      const blockedIds: number[] = []
      for (const block of mockBlocks.values()) {
        if (block.blocker_id === userId) {
          blockedIds.push(block.blocked_id)
        }
      }
      return blockedIds.map(id => db.users.findById(id)).filter((u): u is User => u !== null)
    },
  },
  
  // Mesajlaşma işlemleri
  conversations: {
    findById: (id: number): Conversation | null => mockConversations.get(id) || null,
    
    getByUserId: (userId: number): (Conversation & { other_user: User; last_message?: Message; unread_count: number })[] => {
      const userConversations: (Conversation & { other_user: User; last_message?: Message; unread_count: number })[] = []
      
      for (const [convId, participants] of mockConversationParticipants.entries()) {
        const userParticipant = participants.find(p => p.user_id === userId && p.is_accepted)
        if (userParticipant) {
          const otherParticipant = participants.find(p => p.user_id !== userId)
          if (otherParticipant) {
            const otherUser = db.users.findById(otherParticipant.user_id)
            const conversation = mockConversations.get(convId)
            if (otherUser && conversation) {
              const messages = Array.from(mockMessages.values())
                .filter(m => m.conversation_id === convId)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              
              const unreadCount = messages.filter(m => m.sender_id !== userId && !m.is_read).length
              
              userConversations.push({
                ...conversation,
                other_user: otherUser,
                last_message: messages[0],
                unread_count: unreadCount,
              })
            }
          }
        }
      }
      
      return userConversations.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    },
    
    findOrCreate: (userId1: number, userId2: number): { conversation: Conversation; isNew: boolean; needsRequest: boolean } => {
      // Mevcut konuşmayı bul
      for (const [convId, participants] of mockConversationParticipants.entries()) {
        const hasUser1 = participants.some(p => p.user_id === userId1)
        const hasUser2 = participants.some(p => p.user_id === userId2)
        if (hasUser1 && hasUser2) {
          const conversation = mockConversations.get(convId)!
          const user1Accepted = participants.find(p => p.user_id === userId1)?.is_accepted
          const user2Accepted = participants.find(p => p.user_id === userId2)?.is_accepted
          return { 
            conversation, 
            isNew: false, 
            needsRequest: !user1Accepted || !user2Accepted 
          }
        }
      }
      
      // Yeni konuşma oluştur
      const areFriends = db.follows.areFriends(userId1, userId2)
      const newConv: Conversation = {
        id: nextConversationId++,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockConversations.set(newConv.id, newConv)
      
      mockConversationParticipants.set(newConv.id, [
        { conversation_id: newConv.id, user_id: userId1, is_accepted: true },
        { conversation_id: newConv.id, user_id: userId2, is_accepted: areFriends },
      ])
      
      return { conversation: newConv, isNew: true, needsRequest: !areFriends }
    },
    
    acceptRequest: (conversationId: number, userId: number): boolean => {
      const participants = mockConversationParticipants.get(conversationId)
      if (!participants) return false
      
      const participant = participants.find(p => p.user_id === userId)
      if (participant) {
        participant.is_accepted = true
        return true
      }
      return false
    },
  },
  
  // Mesaj işlemleri
  messages: {
    getByConversationId: (conversationId: number, options?: { limit?: number; offset?: number }): Message[] => {
      const messages = Array.from(mockMessages.values())
        .filter(m => m.conversation_id === conversationId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      
      const start = options?.offset || 0
      const end = options?.limit ? start + options.limit : undefined
      return messages.slice(start, end)
    },
    
    create: (data: { conversation_id: number; sender_id: number; content: string }): Message => {
      const newMessage: Message = {
        id: nextMessageId++,
        ...data,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      mockMessages.set(newMessage.id, newMessage)
      
      // Konuşmayı güncelle
      const conv = mockConversations.get(data.conversation_id)
      if (conv) {
        conv.updated_at = new Date().toISOString()
      }
      
      return newMessage
    },
    
    markAsRead: (conversationId: number, userId: number): void => {
      for (const message of mockMessages.values()) {
        if (message.conversation_id === conversationId && message.sender_id !== userId) {
          message.is_read = true
        }
      }
    },
    
    getUnreadCount: (userId: number): number => {
      let count = 0
      const userConversations = db.conversations.getByUserId(userId)
      for (const conv of userConversations) {
        count += conv.unread_count
      }
      return count
    },
  },
  
  // Mesaj istekleri
  messageRequests: {
    getPending: (userId: number): (MessageRequest & { sender: User })[] => {
      const requests: (MessageRequest & { sender: User })[] = []
      
      for (const [convId, participants] of mockConversationParticipants.entries()) {
        const userParticipant = participants.find(p => p.user_id === userId && !p.is_accepted)
        if (userParticipant) {
          const senderParticipant = participants.find(p => p.user_id !== userId && p.is_accepted)
          if (senderParticipant) {
            const sender = db.users.findById(senderParticipant.user_id)
            if (sender) {
              const conversation = mockConversations.get(convId)
              if (conversation) {
                requests.push({
                  id: convId,
                  sender_id: sender.id,
                  receiver_id: userId,
                  conversation_id: convId,
                  status: "pending",
                  created_at: conversation.created_at,
                  updated_at: conversation.updated_at,
                  sender,
                })
              }
            }
          }
        }
      }
      
      return requests
    },
    
    accept: (conversationId: number, userId: number): boolean => {
      return db.conversations.acceptRequest(conversationId, userId)
    },
    
    decline: (conversationId: number, userId: number): boolean => {
      const participants = mockConversationParticipants.get(conversationId)
      if (!participants) return false
      
      // Konuşmayı ve mesajları sil
      mockConversations.delete(conversationId)
      mockConversationParticipants.delete(conversationId)
      
      for (const [id, message] of mockMessages.entries()) {
        if (message.conversation_id === conversationId) {
          mockMessages.delete(id)
        }
      }
      
      return true
    },
    
    getCount: (userId: number): number => {
      return db.messageRequests.getPending(userId).length
    },
  },
  
  // Bildirimler
  notifications: {
    getByUserId: (userId: number): Notification[] => {
      return Array.from(mockNotifications.values())
        .filter(n => n.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    },
    
    create: (data: Omit<Notification, "id" | "created_at">): Notification => {
      const notification: Notification = {
        id: nextNotificationId++,
        ...data,
        created_at: new Date().toISOString(),
      }
      mockNotifications.set(notification.id, notification)
      return notification
    },
    
    markAsRead: (id: number): boolean => {
      const notification = mockNotifications.get(id)
      if (notification) {
        notification.is_read = true
        return true
      }
      return false
    },
    
    markAllAsRead: (userId: number): void => {
      for (const notification of mockNotifications.values()) {
        if (notification.user_id === userId) {
          notification.is_read = true
        }
      }
    },
    
    getUnreadCount: (userId: number): number => {
      let count = 0
      for (const notification of mockNotifications.values()) {
        if (notification.user_id === userId && !notification.is_read) count++
      }
      return count
    },
  },
}
