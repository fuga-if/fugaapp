-- Fix character ranking duplicates: GROUP BY mal_id only, use MAX for name/anime_title
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
    MAX(c->>'name'),
    MAX(c->>'anime_title'),
    COUNT(*) as pick_count
  FROM mybest_shares, jsonb_array_elements(characters) AS c
  WHERE seiyuu_mal_id = p_seiyuu_mal_id
    AND (p_age_range IS NULL OR age_range = p_age_range)
    AND (p_gender IS NULL OR gender = p_gender)
  GROUP BY 1
  ORDER BY pick_count DESC
  LIMIT p_limit;
$$;
