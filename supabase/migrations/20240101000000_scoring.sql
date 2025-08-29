-- Auxiliary tables for scoring
create table if not exists flavor_synergy (
  flavor_a text not null,
  flavor_b text not null,
  score integer not null,
  primary key (flavor_a, flavor_b)
);

insert into flavor_synergy (flavor_a, flavor_b, score) values
('sweet','sweet',0),
('sweet','salty',2),
('sweet','sour',1),
('sweet','bitter',0),
('sweet','spicy',1),
('sweet','umami',1),
('salty','sweet',2),
('salty','salty',0),
('salty','sour',0),
('salty','bitter',0),
('salty','spicy',1),
('salty','umami',2),
('sour','sweet',1),
('sour','salty',0),
('sour','sour',0),
('sour','bitter',-1),
('sour','spicy',1),
('sour','umami',0),
('bitter','sweet',0),
('bitter','salty',0),
('bitter','sour',-1),
('bitter','bitter',0),
('bitter','spicy',0),
('bitter','umami',1),
('spicy','sweet',1),
('spicy','salty',1),
('spicy','sour',1),
('spicy','bitter',0),
('spicy','spicy',0),
('spicy','umami',1),
('umami','sweet',1),
('umami','salty',2),
('umami','sour',0),
('umami','bitter',1),
('umami','spicy',1),
('umami','umami',0);

create table if not exists texture_synergy (
  texture_a text not null,
  texture_b text not null,
  score integer not null,
  primary key (texture_a, texture_b)
);

insert into texture_synergy (texture_a, texture_b, score) values
('crunchy','crunchy',0),
('crunchy','creamy',2),
('crunchy','soft',1),
('crunchy','liquid',0),
('creamy','crunchy',2),
('creamy','creamy',0),
('creamy','soft',0),
('creamy','liquid',1),
('soft','crunchy',1),
('soft','creamy',0),
('soft','soft',0),
('soft','liquid',0),
('liquid','crunchy',0),
('liquid','creamy',1),
('liquid','soft',0),
('liquid','liquid',0);

create table if not exists tag_bonus (
  tag text primary key,
  bonus integer not null
);

insert into tag_bonus(tag, bonus) values
('fresh',1),
('grilled',1),
('fermented',2),
('citrus',1);

create table if not exists hard_conflicts (
  a text not null,
  b text not null,
  primary key (a,b)
);

insert into hard_conflicts(a,b) values
('dairy','acid'),
('raw_fish','cheese');

-- Scoring function
create or replace function calculate_score(plate jsonb)
returns integer
language plpgsql
security definer
as $$
declare
  cards jsonb[];
  i int;
  j int;
  s int := 0;
  categories text[];
  flavor_a text;
  flavor_b text;
  texture_a text;
  texture_b text;
  tag text;
  hc record;
  A text[];
  B text[];
  has_fruit boolean;
  has_citrus boolean;
  has_dairy boolean;
  has_acid boolean;
  card jsonb;
  eff text;
begin
  if jsonb_array_length(plate) < 2 then
    return 0;
  end if;

  cards := array(select jsonb_array_elements(plate));

  -- hard conflicts
  for i in 1 .. array_length(cards,1)-1 loop
    for j in i+1 .. array_length(cards,1) loop
      A := array(select value::text from jsonb_array_elements_text(cards[i]->'tags')) ||
           array(select value::text from jsonb_array_elements_text(cards[i]->'category'));
      B := array(select value::text from jsonb_array_elements_text(cards[j]->'tags')) ||
           array(select value::text from jsonb_array_elements_text(cards[j]->'category'));
      for hc in select * from hard_conflicts loop
        if (hc.a = any(A) and hc.b = any(B)) or (hc.b = any(A) and hc.a = any(B)) then
          return -5;
        end if;
      end loop;
    end loop;
  end loop;

  -- pair scores
  for i in 1 .. array_length(cards,1)-1 loop
    for j in i+1 .. array_length(cards,1) loop
      for flavor_a in select value::text from jsonb_array_elements_text(cards[i]->'flavor') loop
        for flavor_b in select value::text from jsonb_array_elements_text(cards[j]->'flavor') loop
          s := s + coalesce((select score from flavor_synergy where flavor_a = flavor_a and flavor_b = flavor_b),0);
        end loop;
      end loop;
      for texture_a in select value::text from jsonb_array_elements_text(cards[i]->'texture') loop
        for texture_b in select value::text from jsonb_array_elements_text(cards[j]->'texture') loop
          s := s + coalesce((select score from texture_synergy where texture_a = texture_a and texture_b = texture_b),0);
        end loop;
      end loop;
      for tag in select value::text from jsonb_array_elements_text(cards[i]->'tags') loop
        s := s + coalesce((select bonus from tag_bonus where tag = tag),0);
      end loop;
      for tag in select value::text from jsonb_array_elements_text(cards[j]->'tags') loop
        s := s + coalesce((select bonus from tag_bonus where tag = tag),0);
      end loop;
    end loop;
  end loop;

  -- category diversity
  categories := array(
    select distinct value::text
    from jsonb_array_elements(plate) p,
         jsonb_array_elements_text(p->'category')
  );
  s := s + least(coalesce(array_length(categories,1),0),3);

  -- gather overall tags for effects
  has_fruit := exists (
    select 1 from jsonb_array_elements(plate) p, jsonb_array_elements_text(p->'category') c where c='fruit'
  );
  has_citrus := exists (
    select 1 from jsonb_array_elements(plate) p, jsonb_array_elements_text(p->'tags') t where t='citrus'
  );
  has_dairy := exists (
    select 1 from jsonb_array_elements(plate) p, jsonb_array_elements_text(coalesce(p->'tags','[]'::jsonb)) t where t='dairy'
    union all
    select 1 from jsonb_array_elements(plate) p, jsonb_array_elements_text(coalesce(p->'category','[]'::jsonb)) c where c='dairy'
    limit 1
  );
  has_acid := exists (
    select 1 from jsonb_array_elements(plate) p, jsonb_array_elements_text(p->'tags') t where t='acid'
  );

  for card in select jsonb_array_elements(plate) loop
    eff := lower(coalesce(card->>'effect',''));
    if eff like '%fruta%' or eff like '%fruit%' then
      if has_fruit then s := s + 3; end if;
    end if;
    if eff like '%cítric%' or eff like '%citrus%' then
      if has_citrus then s := s + 2; end if;
    end if;
    if eff like '%lácte%' or eff like '%dairy%' then
      if has_dairy and has_acid then s := s - 2; end if;
    end if;
  end loop;

  return s;
end;
$$;

-- Restrict function execution
revoke execute on function public.calculate_score(jsonb) from public;
grant execute on function public.calculate_score(jsonb) to authenticated;

-- Enable RLS and allow read for authenticated users on auxiliary tables
alter table flavor_synergy enable row level security;
create policy "read_flavor_synergy_authenticated" on flavor_synergy for select to authenticated using (true);

alter table texture_synergy enable row level security;
create policy "read_texture_synergy_authenticated" on texture_synergy for select to authenticated using (true);

alter table tag_bonus enable row level security;
create policy "read_tag_bonus_authenticated" on tag_bonus for select to authenticated using (true);

alter table hard_conflicts enable row level security;
create policy "read_hard_conflicts_authenticated" on hard_conflicts for select to authenticated using (true);
