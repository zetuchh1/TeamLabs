// Kullanıcı tipleri
export interface User {
  id: number
  username: string
  email: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  cover_image_url: string | null
  email_verified: boolean
  is_active: boolean
  is_private: boolean
  last_seen: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  followers_count: number
  following_count: number
  posts_count: number
  is_following?: boolean
  is_followed_by?: boolean
  is_blocked?: boolean
}

export interface Session {
  id: number
  user_id: number
  session_token: string
  expires_at: string
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Takip sistemi
export interface Follow {
  id: number
  follower_id: number
  following_id: number
  status: 'pending' | 'accepted'
  created_at: string
  follower?: User
  following?: User
}

// Engelleme sistemi
export interface Block {
  id: number
  blocker_id: number
  blocked_id: number
  created_at: string
  blocked_user?: User
}

// Gönderi tipleri
export interface Post {
  id: number
  user_id: number
  content: string
  post_type: 'general' | 'looking_for_friend'
  game_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user?: User
  images?: PostImage[]
}

export interface PostImage {
  id: number
  post_id: number
  image_url: string
  display_order: number
  created_at: string
}

// Mesajlaşma tipleri
export interface Conversation {
  id: number
  created_at: string
  updated_at: string
  participants?: ConversationParticipant[]
  last_message?: Message
  unread_count?: number
}

export interface ConversationParticipant {
  id: number
  conversation_id: number
  user_id: number
  is_accepted: boolean
  last_read_at: string | null
  created_at: string
  user?: User
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  content: string | null
  is_read: boolean
  created_at: string
  sender?: User
  images?: MessageImage[]
}

export interface MessageImage {
  id: number
  message_id: number
  image_url: string
  display_order: number
  created_at: string
}

// Mesaj istekleri
export interface MessageRequest {
  id: number
  sender_id: number
  receiver_id: number
  conversation_id: number
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
  sender?: User
  conversation?: Conversation
}

// Bildirimler
export interface Notification {
  id: number
  user_id: number
  type: 'follow' | 'message' | 'message_request' | 'post_like'
  from_user_id: number | null
  reference_id: number | null
  content: string | null
  is_read: boolean
  created_at: string
  from_user?: User
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Auth tipleri
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  display_name?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Form tipleri
export interface CreatePostForm {
  content: string
  post_type: 'general' | 'looking_for_friend'
  game_name?: string
  images?: File[]
}

export interface SendMessageForm {
  content: string
  images?: File[]
}

export interface UpdateProfileForm {
  display_name?: string
  bio?: string
  avatar?: File
  cover_image?: File
  is_private?: boolean
}
