import * as React from "react";
import { Link } from "wouter";
import { Player } from "../../models/player";
import { teamNameTranslator } from "../../common/utils/player-utils";
import { BiStats } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";
import { Mmr } from "../../common/components/mmr";

type Props = {
	player: Player;
};

export function MemoizedPlayerCard({ player }: Props) {
	const teamNameTranslated = teamNameTranslator(player);
	return (
		<Link to={`/players/${encodeURIComponent(player.name)}`}>
			<div className="fade-in block bg-midnight2 rounded-xl border border-gray-800 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
				<div className="justify-between">
					<div className="flex flex-row w-full">
						<div className="mr-4 rounded-tl-xl">
							<img className="rounded-tl-xl rounded-br-xl" width={64} height={64} loading="lazy" src={player.avatarUrl} alt="" />
						</div>
						<div className="pt-2 text-center grow">
							<h2 className="text-l md:text-xl font-bold text-white grow">
								<span className="truncate ...">{player.name}</span>
							</h2>
							<div className="text-xs text-slate-400 pt-1 font-bold">
								{player.role}
							</div>
						</div>
					</div>
					<div>
						<div className="p-1 text-sm text-gray-300">
							<div className="text-center">
								<div className="text-xs h-8">
									{player.tier.name}{" "}
									<div className="italic">
										{" "}
										- {player.team?.franchise.prefix ?? ""} {teamNameTranslated}
									</div>
								</div>
							</div>
							<div className="flex justify-center gap-4 py-1">
								<div className="flex">
									<BiStats size="1.5em" className="mr-1 text-orange-500" />{" "}
									{player.stats?.rating.toFixed(2) ?? "N/A"}
								</div>
								<div className="flex">
									<GiMoneyStack size="1.5em" className="mr-1 text-green-500" />{" "}
									<Mmr player={player} />
								</div>
							</div>
							{window.debug === true && (
								<code>
									DiscordId {player.discordId}
									<br />
									SteamId {player.steam64Id}
								</code>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

export const PlayerCard = React.memo(MemoizedPlayerCard);
