export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "AI"
  | "Tools";

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          github_url: string | null;
          live_url: string | null;
          technologies: string[];
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          technologies?: string[];
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          technologies?: string[];
          featured?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: SkillCategory;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: SkillCategory;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: SkillCategory;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          subject: string | null;
          message: string;
          status: "new" | "read" | "replied" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: "new" | "read" | "replied" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          status?: "new" | "read" | "replied" | "archived";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type SocialLinkInsert =
  Database["public"]["Tables"]["social_links"]["Insert"];
