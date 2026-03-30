export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          whatsapp?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      plans: {
        Row: {
          id: string
          name: string
          data_gb: number
          validity_days: number
          region: string
          countries: string[]
          price_pkr: number
          price_usd: number
          is_active: boolean
          is_featured: boolean
          badge: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          data_gb: number
          validity_days: number
          region: string
          countries?: string[]
          price_pkr: number
          price_usd: number
          is_active?: boolean
          is_featured?: boolean
          badge?: string | null
          description?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['plans']['Insert']>
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          plan_id: string
          status: OrderStatus
          payment_method: PaymentMethod
          amount_paid: number
          currency: 'PKR' | 'USD'
          qr_code_url: string | null
          esim_code: string | null
          iccid: string | null
          activated_at: string | null
          expires_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          plan_id: string
          status?: OrderStatus
          payment_method: PaymentMethod
          amount_paid: number
          currency: 'PKR' | 'USD'
          qr_code_url?: string | null
          esim_code?: string | null
          iccid?: string | null
          activated_at?: string | null
          expires_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      payments: {
        Row: {
          id: string
          order_id: string
          gateway: PaymentMethod
          transaction_id: string | null
          amount: number
          currency: string
          status: PaymentStatus
          gateway_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          gateway: PaymentMethod
          transaction_id?: string | null
          amount: number
          currency: string
          status: PaymentStatus
          gateway_response?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      admins: {
        Row: {
          id: string
          email: string
          role: 'super_admin' | 'admin' | 'support'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'super_admin' | 'admin' | 'support'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['admins']['Insert']>
      }
    }
  }
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'delivered' | 'activated' | 'expired' | 'cancelled'
export type PaymentMethod = 'safepay' | 'stripe' | 'manual'
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

// Convenience types
export type Customer = Database['public']['Tables']['customers']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Admin = Database['public']['Tables']['admins']['Row']

export type OrderWithDetails = Order & {
  customers: Customer
  plans: Plan
  payments: Payment[]
}
