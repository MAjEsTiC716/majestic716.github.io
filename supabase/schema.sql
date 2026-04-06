create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are readable by authenticated users" on public.profiles;
create policy "profiles are readable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

drop policy if exists "users manage their own profile" on public.profiles;
create policy "users manage their own profile"
  on public.profiles
  for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_user_id uuid not null references auth.users(id) on delete cascade,
  guest_user_id uuid references auth.users(id) on delete set null,
  x_user_id uuid not null references auth.users(id) on delete cascade,
  o_user_id uuid references auth.users(id) on delete set null,
  board text[] not null default array['', '', '', '', '', '', '', '', ''],
  current_turn text not null default 'X' check (current_turn in ('X', 'O')),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  winner text check (winner in ('X', 'O', 'draw')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint game_rooms_board_len check (cardinality(board) = 9)
);

create or replace function public.touch_game_room()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists touch_game_room on public.game_rooms;
create trigger touch_game_room
before update on public.game_rooms
for each row execute function public.touch_game_room();

alter table public.game_rooms enable row level security;

drop policy if exists "participants can read their rooms" on public.game_rooms;
create policy "participants can read their rooms"
  on public.game_rooms
  for select
  to authenticated
  using (
    auth.uid() = host_user_id
    or auth.uid() = guest_user_id
    or auth.uid() = x_user_id
    or auth.uid() = o_user_id
  );

create or replace function public.generate_room_code()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6));
    exit when not exists (
      select 1 from public.game_rooms where code = candidate
    );
  end loop;

  return candidate;
end;
$$;

create or replace function public.evaluate_tic_tac_toe(board text[])
returns text
language plpgsql
immutable
as $$
begin
  if board[1] <> '' and board[1] = board[2] and board[2] = board[3] then
    return board[1];
  elsif board[4] <> '' and board[4] = board[5] and board[5] = board[6] then
    return board[4];
  elsif board[7] <> '' and board[7] = board[8] and board[8] = board[9] then
    return board[7];
  elsif board[1] <> '' and board[1] = board[4] and board[4] = board[7] then
    return board[1];
  elsif board[2] <> '' and board[2] = board[5] and board[5] = board[8] then
    return board[2];
  elsif board[3] <> '' and board[3] = board[6] and board[6] = board[9] then
    return board[3];
  elsif board[1] <> '' and board[1] = board[5] and board[5] = board[9] then
    return board[1];
  elsif board[3] <> '' and board[3] = board[5] and board[5] = board[7] then
    return board[3];
  elsif not ('' = any(board)) then
    return 'draw';
  end if;

  return null;
end;
$$;

create or replace function public.create_tic_tac_toe_room()
returns setof public.game_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  new_room public.game_rooms;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.game_rooms (
    code,
    host_user_id,
    x_user_id
  )
  values (
    public.generate_room_code(),
    auth.uid(),
    auth.uid()
  )
  returning * into new_room;

  return query select * from public.game_rooms where id = new_room.id;
end;
$$;

create or replace function public.join_tic_tac_toe_room(room_code text)
returns setof public.game_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.game_rooms;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into target
  from public.game_rooms
  where code = upper(room_code)
  for update;

  if target.id is null then
    raise exception 'Room not found';
  end if;

  if auth.uid() = target.host_user_id or auth.uid() = target.guest_user_id then
    return query select * from public.game_rooms where id = target.id;
    return;
  end if;

  if target.guest_user_id is not null then
    raise exception 'Room is already full';
  end if;

  update public.game_rooms
  set
    guest_user_id = auth.uid(),
    o_user_id = auth.uid(),
    status = 'active',
    current_turn = 'X'
  where id = target.id;

  return query select * from public.game_rooms where id = target.id;
end;
$$;

create or replace function public.make_tic_tac_toe_move(room_id uuid, cell_index integer)
returns setof public.game_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.game_rooms;
  next_board text[];
  acting_symbol text;
  resolved_winner text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if cell_index < 0 or cell_index > 8 then
    raise exception 'Invalid board index';
  end if;

  select * into target
  from public.game_rooms
  where id = room_id
  for update;

  if target.id is null then
    raise exception 'Room not found';
  end if;

  if target.status <> 'active' then
    raise exception 'Game is not active';
  end if;

  if auth.uid() = target.x_user_id then
    acting_symbol := 'X';
  elsif auth.uid() = target.o_user_id then
    acting_symbol := 'O';
  else
    raise exception 'You are not part of this room';
  end if;

  if target.current_turn <> acting_symbol then
    raise exception 'It is not your turn';
  end if;

  if target.board[cell_index + 1] <> '' then
    raise exception 'Cell is already occupied';
  end if;

  next_board := target.board;
  next_board[cell_index + 1] := acting_symbol;
  resolved_winner := public.evaluate_tic_tac_toe(next_board);

  update public.game_rooms
  set
    board = next_board,
    current_turn = case when acting_symbol = 'X' then 'O' else 'X' end,
    status = case when resolved_winner is null then 'active' else 'finished' end,
    winner = resolved_winner
  where id = target.id;

  return query select * from public.game_rooms where id = target.id;
end;
$$;

create or replace function public.reset_tic_tac_toe_room(room_id uuid)
returns setof public.game_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.game_rooms;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into target
  from public.game_rooms
  where id = room_id
  for update;

  if target.id is null then
    raise exception 'Room not found';
  end if;

  if auth.uid() <> target.host_user_id and auth.uid() <> target.guest_user_id then
    raise exception 'Only room participants can reset the game';
  end if;

  update public.game_rooms
  set
    board = array['', '', '', '', '', '', '', '', ''],
    current_turn = 'X',
    status = case when target.guest_user_id is null then 'waiting' else 'active' end,
    winner = null
  where id = target.id;

  return query select * from public.game_rooms where id = target.id;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.game_rooms to authenticated;
grant execute on function public.create_tic_tac_toe_room() to authenticated;
grant execute on function public.join_tic_tac_toe_room(text) to authenticated;
grant execute on function public.make_tic_tac_toe_move(uuid, integer) to authenticated;
grant execute on function public.reset_tic_tac_toe_room(uuid) to authenticated;
