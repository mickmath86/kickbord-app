-- Create users table (extends the existing profiles)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_tone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create campaigns/ads table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Property Details
  property_address TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  price DECIMAL(12,2),
  property_type TEXT,
  year_built INTEGER,
  lot_size TEXT,
  hoa_info TEXT,
  features TEXT[], -- Array of features
  keywords TEXT[], -- Array of descriptive keywords
  neighborhood_info TEXT,
  cta_preference TEXT,
  
  -- Campaign Settings
  tone TEXT NOT NULL,
  
  -- Media
  media_urls TEXT[], -- Array of uploaded media URLs
  
  -- Generated Content
  generated_copy JSONB, -- Store all generated copy variants
  generated_visuals JSONB, -- Store visual asset URLs
  landing_page_url TEXT,
  pdf_brochure_url TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own campaigns" ON public.campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for campaign media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campaign-media', 'campaign-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload campaign media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'campaign-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view campaign media" ON storage.objects
  FOR SELECT USING (bucket_id = 'campaign-media');

CREATE POLICY "Users can update own campaign media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'campaign-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own campaign media" ON storage.objects
  FOR DELETE USING (bucket_id = 'campaign-media' AND auth.uid()::text = (storage.foldername(name))[1]);
