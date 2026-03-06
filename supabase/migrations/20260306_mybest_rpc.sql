-- get_trending_seiyuu
CREATE OR REPLACE FUNCTION get_trending_seiyuu(days_back int DEFAULT 7, result_limit int DEFAULT 20)
RETURNS TABLE(seiyuu_mal_id int, seiyuu_name text, share_count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT seiyuu_mal_id, seiyuu_name, COUNT(*) as share_count
  FROM mybest_shares
  WHERE created_at >= now() - interval '1 day' * days_back
  GROUP BY seiyuu_mal_id, seiyuu_name
  ORDER BY share_count DESC
  LIMIT result_limit;
$$;

-- get_character_ranking
CREATE OR REPLACE FUNCTION get_character_ranking(
  p_seiyuu_mal_id int,
  p_age_range text DEFAULT NULL,
  p_gender text DEFAULT NULL,
  p_limit int DEFAULT 10
)
RETURNS TABLE(mal_id int, name text, anime_title text, pick_count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT
    (c->>'mal_id')::int,
    c->>'name',
    c->>'anime_title',
    COUNT(*) as pick_count
  FROM mybest_shares, jsonb_array_elements(characters) AS c
  WHERE seiyuu_mal_id = p_seiyuu_mal_id
    AND (p_age_range IS NULL OR age_range = p_age_range)
    AND (p_gender IS NULL OR gender = p_gender)
  GROUP BY 1, 2, 3
  ORDER BY pick_count DESC
  LIMIT p_limit;
$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mybest_shares_created_at ON mybest_shares(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mybest_shares_seiyuu_mal_id ON mybest_shares(seiyuu_mal_id);
