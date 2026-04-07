import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

type PracticeCell = '' | 'X' | 'O';
type GameWinner = 'X' | 'O' | 'draw' | null;

type Profile = {
  id: string;
  username: string | null;
};

type RoomRecord = {
  id: string;
  code: string;
  board: PracticeCell[];
  current_turn: 'X' | 'O';
  status: 'waiting' | 'active' | 'finished';
  winner: GameWinner;
  host_user_id: string;
  guest_user_id: string | null;
  x_user_id: string;
  o_user_id: string | null;
};

const emptyBoard = (): PracticeCell[] => ['', '', '', '', '', '', '', '', ''];

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function computeWinner(board: PracticeCell[]): GameWinner {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(Boolean) ? 'draw' : null;
}

function makeSupabaseClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

function cardError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

function getEmailRedirectTo() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return `${window.location.origin}/#playground`;
}

export default function PlaygroundApp() {
  const [practiceBoard, setPracticeBoard] = useState<PracticeCell[]>(emptyBoard);
  const [practiceTurn, setPracticeTurn] = useState<'X' | 'O'>('X');
  const [tab, setTab] = useState<'practice' | 'multiplayer'>('practice');

  const supabase = useMemo<SupabaseClient | null>(() => makeSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [roomCode, setRoomCode] = useState('');
  const [activeRoom, setActiveRoom] = useState<RoomRecord | null>(null);
  const [gameMessage, setGameMessage] = useState<string>('Create a room or join one with a code.');
  const [gameError, setGameError] = useState<string | null>(null);
  const [gameBusy, setGameBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let ignore = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (ignore) {
        return;
      }

      if (error) {
        setAuthError(error.message);
        return;
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setAuthMessage(null);
      setAuthError(null);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    let ignore = false;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .maybeSingle();

      if (ignore) {
        return;
      }

      if (error) {
        setAuthError(error.message);
        return;
      }

      setProfile(data);
      setUsername(data?.username ?? '');
    };

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase || !activeRoom?.id || !user) {
      return;
    }

    let isMounted = true;

    const updateFromRow = (nextRoom: RoomRecord) => {
      if (!isMounted) {
        return;
      }

      setActiveRoom(nextRoom);

      if (nextRoom.status === 'waiting') {
        setGameMessage(`Room ${nextRoom.code} is waiting for a second player.`);
        return;
      }

      if (nextRoom.status === 'finished') {
        if (nextRoom.winner === 'draw') {
          setGameMessage(`Room ${nextRoom.code} ended in a draw.`);
        } else {
          setGameMessage(`Room ${nextRoom.code} winner: ${nextRoom.winner}.`);
        }

        return;
      }

      const me = nextRoom.x_user_id === user.id ? 'X' : nextRoom.o_user_id === user.id ? 'O' : null;
      if (!me) {
        setGameMessage(`Watching room ${nextRoom.code}.`);
        return;
      }

      setGameMessage(
        nextRoom.current_turn === me
          ? `Your turn in room ${nextRoom.code}.`
          : `Opponent turn in room ${nextRoom.code}.`,
      );
    };

    const refreshRoom = async () => {
      const { data, error } = await supabase.from('game_rooms').select('*').eq('id', activeRoom.id).maybeSingle();
      if (error) {
        setGameError(error.message);
        return;
      }

      if (data) {
        updateFromRow(data as RoomRecord);
      }
    };

    void refreshRoom();

    const channel: RealtimeChannel = supabase
      .channel(`tic-tac-toe-room-${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${activeRoom.id}`,
        },
        (payload) => {
          if (payload.new) {
            updateFromRow(payload.new as RoomRecord);
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [activeRoom?.id, supabase, user]);

  const practiceWinner = computeWinner(practiceBoard);

  const activeSymbol = useMemo(() => {
    if (!activeRoom || !user) {
      return null;
    }

    if (activeRoom.x_user_id === user.id) {
      return 'X';
    }

    if (activeRoom.o_user_id === user.id) {
      return 'O';
    }

    return null;
  }, [activeRoom, user]);

  const handlePracticeClick = (index: number) => {
    if (practiceBoard[index] || practiceWinner) {
      return;
    }

    const next = [...practiceBoard];
    next[index] = practiceTurn;
    setPracticeBoard(next);
    setPracticeTurn(practiceTurn === 'X' ? 'O' : 'X');
  };

  const resetPractice = () => {
    setPracticeBoard(emptyBoard());
    setPracticeTurn('X');
  };

  const handleAuth = async () => {
    if (!supabase) {
      return;
    }

    setAuthBusy(true);
    setAuthMessage(null);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getEmailRedirectTo(),
            data: {
              username,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username,
          });
        }

        setAuthMessage('Account created. If your project requires email confirmation, confirm it and then log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        setAuthMessage('Signed in.');
      }
    } catch (error) {
      setAuthError(cardError(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const updateProfile = async () => {
    if (!supabase || !user) {
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setAuthMessage(null);

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
      });

      if (error) {
        throw error;
      }

      setProfile({
        id: user.id,
        username,
      });
      setAuthMessage('Profile saved.');
    } catch (error) {
      setAuthError(cardError(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setActiveRoom(null);
    setGameError(null);
    setGameMessage('Create a room or join one with a code.');
  };

  const createRoom = async () => {
    if (!supabase) {
      return;
    }

    setGameBusy(true);
    setGameError(null);

    try {
      const { data, error } = await supabase.rpc('create_tic_tac_toe_room');
      if (error) {
        throw error;
      }

      const room = Array.isArray(data) ? data[0] : data;
      setActiveRoom(room as RoomRecord);
      setRoomCode((room as RoomRecord).code);
      setGameMessage(`Room ${(room as RoomRecord).code} created. Share the code with another player.`);
    } catch (error) {
      setGameError(cardError(error));
    } finally {
      setGameBusy(false);
    }
  };

  const joinRoom = async () => {
    if (!supabase || !roomCode.trim()) {
      return;
    }

    setGameBusy(true);
    setGameError(null);

    try {
      const { data, error } = await supabase.rpc('join_tic_tac_toe_room', {
        room_code: roomCode.trim().toUpperCase(),
      });

      if (error) {
        throw error;
      }

      const room = Array.isArray(data) ? data[0] : data;
      setActiveRoom(room as RoomRecord);
      setGameMessage(`Joined room ${(room as RoomRecord).code}.`);
    } catch (error) {
      setGameError(cardError(error));
    } finally {
      setGameBusy(false);
    }
  };

  const makeMove = async (index: number) => {
    if (!supabase || !activeRoom || !activeSymbol || activeRoom.status !== 'active') {
      return;
    }

    if (activeRoom.current_turn !== activeSymbol || activeRoom.board[index]) {
      return;
    }

    setGameBusy(true);
    setGameError(null);

    try {
      const { data, error } = await supabase.rpc('make_tic_tac_toe_move', {
        room_id: activeRoom.id,
        cell_index: index,
      });

      if (error) {
        throw error;
      }

      const room = Array.isArray(data) ? data[0] : data;
      setActiveRoom(room as RoomRecord);
    } catch (error) {
      setGameError(cardError(error));
    } finally {
      setGameBusy(false);
    }
  };

  const resetRoom = async () => {
    if (!supabase || !activeRoom) {
      return;
    }

    setGameBusy(true);
    setGameError(null);

    try {
      const { data, error } = await supabase.rpc('reset_tic_tac_toe_room', {
        room_id: activeRoom.id,
      });

      if (error) {
        throw error;
      }

      const room = Array.isArray(data) ? data[0] : data;
      setActiveRoom(room as RoomRecord);
      setGameMessage(`Room ${(room as RoomRecord).code} has been reset.`);
    } catch (error) {
      setGameError(cardError(error));
    } finally {
      setGameBusy(false);
    }
  };

  return (
    <div className="playground-shell panel">
      <div className="playground-tabs">
        <button
          className={`playground-tab ${tab === 'practice' ? 'active' : ''}`}
          onClick={() => setTab('practice')}
          type="button"
        >
          Practice Mode
        </button>
        <button
          className={`playground-tab ${tab === 'multiplayer' ? 'active' : ''}`}
          onClick={() => setTab('multiplayer')}
          type="button"
        >
          Supabase Multiplayer
        </button>
      </div>

      {tab === 'practice' ? (
        <section className="playground-grid">
          <div className="playground-card">
            <p className="playground-label">Local game</p>
            <h3>Tic-Tac-Toe Warmup</h3>
            <p className="playground-copy">
              This local version keeps the page interactive even before the backend is configured.
            </p>
            <div className="board">
              {practiceBoard.map((cell, index) => (
                <button
                  className="cell"
                  key={`practice-${index}`}
                  onClick={() => handlePracticeClick(index)}
                  type="button"
                >
                  {cell}
                </button>
              ))}
            </div>
            <div className="playground-actions">
              <span className="pill">
                {practiceWinner
                  ? practiceWinner === 'draw'
                    ? 'Draw game'
                    : `${practiceWinner} wins`
                  : `Turn: ${practiceTurn}`}
              </span>
              <button className="button secondary" onClick={resetPractice} type="button">
                Reset Practice
              </button>
            </div>
          </div>

          <div className="playground-card playground-aside">
            <p className="playground-label">What this proves</p>
            <ul className="playground-list">
              <li>State-driven UI updates</li>
              <li>Interaction design inside a static GitHub-hosted site</li>
              <li>A clean bridge into the multiplayer version below</li>
            </ul>
          </div>
        </section>
      ) : (
        <section className="playground-grid">
          <div className="playground-card">
            <p className="playground-label">Account</p>
            {!supabase ? (
              <div className="setup-card">
                <h3>Supabase configuration required</h3>
                <p>
                  Add <code>PUBLIC_SUPABASE_URL</code> and <code>PUBLIC_SUPABASE_ANON_KEY</code> to your
                  environment, then run the SQL in <code>supabase/schema.sql</code>.
                </p>
              </div>
            ) : !session || !user ? (
              <>
                <h3>Sign in to unlock multiplayer</h3>
                <p className="playground-copy">
                  Use email/password auth to create a profile, persist your username, and join rooms.
                </p>
                <div className="form-grid">
                  <label>
                    <span>Email</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                  </label>
                  <label>
                    <span>Password</span>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                  </label>
                  <label>
                    <span>Username</span>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
                  </label>
                </div>
                <div className="playground-actions">
                  <button className="button" disabled={authBusy} onClick={handleAuth} type="button">
                    {authBusy ? 'Working...' : authMode === 'signup' ? 'Create Account' : 'Log In'}
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    type="button"
                  >
                    Switch to {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                  </button>
                </div>
                {authMessage ? <p className="status-ok">{authMessage}</p> : null}
                {authError ? <p className="status-error">{authError}</p> : null}
              </>
            ) : (
              <>
                <h3>{profile?.username || user.email}</h3>
                <p className="playground-copy">
                  Your account is ready. Update the visible username, create a room, or join one with a code.
                </p>
                <div className="form-grid">
                  <label>
                    <span>Username</span>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
                  </label>
                  <label>
                    <span>Email</span>
                    <input disabled value={user.email ?? ''} type="text" />
                  </label>
                </div>
                <div className="playground-actions">
                  <button className="button" disabled={authBusy} onClick={updateProfile} type="button">
                    Save Profile
                  </button>
                  <button className="button secondary" onClick={signOut} type="button">
                    Sign Out
                  </button>
                </div>
                {authMessage ? <p className="status-ok">{authMessage}</p> : null}
                {authError ? <p className="status-error">{authError}</p> : null}
              </>
            )}
          </div>

          <div className="playground-card">
            <p className="playground-label">Realtime Game</p>
            <h3>Multiplayer Tic-Tac-Toe</h3>
            <p className="playground-copy">
              The room state lives in Supabase. Auth identifies the players, the database stores the room, and
              realtime updates keep both browsers in sync.
            </p>
            <div className="form-grid compact">
              <label>
                <span>Room Code</span>
                <input
                  maxLength={6}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  value={roomCode}
                />
              </label>
            </div>
            <div className="playground-actions">
              <button className="button" disabled={!session || gameBusy || !supabase} onClick={createRoom} type="button">
                Create Room
              </button>
              <button className="button secondary" disabled={!session || gameBusy || !supabase} onClick={joinRoom} type="button">
                Join Room
              </button>
              <button
                className="button secondary"
                disabled={!activeRoom || gameBusy || !supabase}
                onClick={resetRoom}
                type="button"
              >
                Reset Room
              </button>
            </div>

            <div className="board multiplayer">
              {(activeRoom?.board ?? emptyBoard()).map((cell, index) => (
                <button
                  className="cell"
                  disabled={!activeRoom || gameBusy || activeRoom.status !== 'active'}
                  key={`multiplayer-${index}`}
                  onClick={() => makeMove(index)}
                  type="button"
                >
                  {cell}
                </button>
              ))}
            </div>

            <div className="room-meta">
              <span className="pill">Status: {activeRoom?.status ?? 'setup'}</span>
              <span className="pill">You are: {activeSymbol ?? '-'}</span>
              <span className="pill">Turn: {activeRoom?.current_turn ?? '-'}</span>
            </div>

            <p className="status-ok">{gameMessage}</p>
            {gameError ? <p className="status-error">{gameError}</p> : null}
          </div>
        </section>
      )}
    </div>
  );
}
