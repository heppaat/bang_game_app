import { authorize, getGame, deleteUserFromGame } from "../api";
import { GameSchema } from "../model";
import { z } from "zod";
import { useState } from "react";

type Game = z.infer<typeof GameSchema>;

const GameComponent = (props: { gameId: number; loggedInUsername: string }) => {
  const { gameId, loggedInUsername } = props;

  const [game, setGame] = useState<Game | null>(null);

  setInterval(async () => {
    const response = await getGame(gameId);
    if (!response.success) return;
    setGame(response.data);
  }, 1000);

  const addPlayer = async (playerId: number) => {
    await authorize(gameId, playerId);
  };

  const deletePlayer = async (username: string) => {
    await deleteUserFromGame(gameId, username);
  };

  return (
    <div>
      {!game && (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {game && !game.hasStarted && (
        <div className="flex flex-col items-center py-16">
          <div className="card bg-secondary text-secondary-content w-[300px] pb-8">
            {game.joinedUsers.length > 8 ||
              game.joinedUsers.length < 4 ||
              (loggedInUsername !== game.admin && (
                <div className="flex justify-center my-8">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              ))}
            {game.joinedUsers.length <= 8 &&
              game.joinedUsers.length >= 4 &&
              loggedInUsername === game.admin && (
                <div className="flex justify-center my-8">
                  <button className="btn btn-primary">Start Game</button>
                </div>
              )}
            <div className="divider">Joined players</div>
            {game.joinedUsers.map((user, index) => (
              <div
                key={index}
                className="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center"
              >
                {user.name}
                {loggedInUsername === game.admin &&
                  loggedInUsername !== user.name && (
                    <button
                      onClick={() => deletePlayer(user.name)}
                      className="btn btn-sm"
                    >
                      Kick
                    </button>
                  )}
                {loggedInUsername === user.name && (
                  <button
                    onClick={() => deletePlayer(user.name)}
                    className="btn btn-sm"
                  >
                    Leave
                  </button>
                )}
              </div>
            ))}
            <div className="divider">Waiting in lobby...</div>
            {game.requests.map((user, index) => (
              <div
                key={index}
                className="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center"
              >
                <span>{user.name}</span>
                {loggedInUsername === game.admin && (
                  <button
                    onClick={() => addPlayer(user.id)}
                    className="btn btn-sm"
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameComponent;
