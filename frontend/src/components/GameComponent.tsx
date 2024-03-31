import { getGame } from "../api";
import { GameSchema } from "../model";
import { z } from "zod";
import { useState } from "react";

type Game = z.infer<typeof GameSchema>;

const GameComponent = (props: { gameId: number }) => {
  const { gameId } = props;
  const [game, setGame] = useState<Game | null>(null);

  setInterval(async () => {
    const response = await getGame(gameId);
    if (!response.success) return;
    setGame(response.data);
  }, 1000);

  return (
    <div>
      {!game && (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}
    </div>
  );
};

export default GameComponent;
