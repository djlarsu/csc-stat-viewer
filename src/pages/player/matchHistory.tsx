import * as React from "react";
import { Player } from "../../models";
import { Loading } from "../../common/components/loading";
import { mapImages } from "../../common/images/maps";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { useCscPlayerMatchHistoryGraph } from "../../dao/cscPlayerMatchHistoryGraph";
import { Match } from "../../models/csc-player-match-history-types";

type Props = {
    player: Player;
}

function MatchHistory( { player, match }: { player: Player, match: Match } ) {
    const teamHome = match?.matchStats.filter( p => p.teamClanName === "team_home" || p.teamClanName === "StartedCT").sort( (a, b) => b.rating - a.rating );
    const teamAway = match?.matchStats.filter( p => p.teamClanName === "team_away" || p.teamClanName === "StartedT" ).sort( (a, b) => b.rating - a.rating );

    return (
        <div className="pl-16 text-xs pb-4">
              <div className="flex flex-row pl-2 gap-4 h-8 items-center border-b border-gray-600">
                <div className="basis-1/6">Name</div>
                <div className="basis-1/6">Rating</div>
                <div className="basis-1/6">K / D / A</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash Assists</div>
            </div>
            { teamHome?.map( (playerStat, index) => 
                    <div className={`flex flex-nowrap gap-4 py-1 hover:cursor-pointer hover:bg-midnight2 rounded ${ playerStat.name === player.name ? "text-yellow-300" : ""}`}>
                        <div className={`basis-1/6`}>{playerStat.name}</div>
                        <div className="basis-1/6">{playerStat.rating.toFixed(2)}</div>
                        <div className="basis-1/6">{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}</div>
                        <div className="basis-1/12">{playerStat.adr.toFixed(2)}</div>
                        <div className="basis-1/12">{playerStat.hs}</div>
                        <div className="basis-1/12">{playerStat.FAss}</div>
                    </div> 
                )
            }
            <br />
            { teamAway?.map( (playerStat, index) => 
                    <div className={`flex flex-nowrap gap-4 py-1 hover:cursor-pointer hover:bg-midnight2 rounded ${ playerStat.name === player.name ? "text-yellow-300" : ""}`}>
                    <div className={`basis-1/6`}>{playerStat.name}</div>
                    <div className="basis-1/6">{playerStat.rating.toFixed(2)}</div>
                    <div className="basis-1/6">{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}</div>
                    <div className="basis-1/12">{playerStat.adr.toFixed(2)}</div>
                    <div className="basis-1/12">{playerStat.hs}</div>
                    <div className="basis-1/12">{playerStat.FAss}</div>
                </div> 
                )
          }
        </div>
    )
};
        

function MatchRow( { player, match }: { player: Player, match: Match } ) {
    const [ isExpanded, setIsExpanded ] = React.useState(false);
    const matchType = match.matchType ?? "broke"
    const p = match.matchStats.find( ms => ms.name === player.name )!;

    if(p === undefined) {
        console.info('Player is missing match because their name does not appear as a player, possible name change?',p, 'match', match);
        return null;
    }

    return (
        <div>
            <div className="flex flex-nowrap gap-4 my-1 py-2 hover:cursor-pointer hover:bg-midnight2 rounded pl-2 text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-8">{ isExpanded ? <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowRight size="1.5em" className='leading-8 pl-1' />}</div>
                <div className="basis-1/12"> {matchType} <div className="text-xs text-gray-700">{match?.createdAt?.split("T")[0] ?? 0}</div></div>
                <div className="basis-1/5"><span className="flex gap-2"><div className='text-sm'><img className='w-8 h-8 mx-auto' src={mapImages[match.mapName.toLowerCase()]} alt=""/></div> {match.mapName}</span></div>
                <div className={`basis-1/12 min-w-32 ${p.RF > p.RA ? "text-green-400" : "text-rose-400"}`}><span className="flex flex-nowrap">{p.RF} : {p.RA}</span></div>
                <div className="basis-1/12">{p.rating.toFixed(2)}</div>
                <div className="basis-1/6">{p.kills} / {p.deaths} / {p.assists}</div>
                <div className="basis-1/12">{p.adr.toFixed(2)}</div>
                <div className="basis-1/12">{p.hs}</div>
                <div className="basis-1/12">{p?.FAss}</div>
            </div>
            {
                isExpanded && <MatchHistory player={player} match={match} />
            }
        </div>
        
        );
}

export function PlayerMatchHistory( { player }: Props ) {
    const { data: playerMatchHistory, isLoading: isLoadingPlayerMatchHistory } = useCscPlayerMatchHistoryGraph( player );
    const [ showAll, setShowAll ] = React.useState( false );

    console.info( 'playerMatchHistory', playerMatchHistory);

    const sortedPlayerMatchHistory = playerMatchHistory?.sort( (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() );

    if( playerMatchHistory?.length === 0 && !playerMatchHistory) {
        return null;
    }

    if( isLoadingPlayerMatchHistory ){
        return <div><Loading /></div>;
    }

    return (
        <div className="my-4 p-4">
            <h2 className="text-2xl text-center"><span className="font-bold">Match History</span> - {playerMatchHistory?.length} matches</h2>
            <h2 className="text-center text-sm text-gray-600">Beta Feature</h2>
            <div className="flex flex-row pl-2 gap-4 h-16 items-center border-b border-gray-600">
                <div className="w-8"></div>
                <div className="basis-1/12">Type</div>
                <div className="basis-1/5">Map</div>
                <div className="basis-1/12">Score</div>
                <div className="basis-1/12">Rating</div>
                <div className="basis-1/6">K / D / A</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash Assists</div>
            </div>
            {
                ( showAll ? sortedPlayerMatchHistory : sortedPlayerMatchHistory?.slice(0,5))?.map( (match) => <MatchRow key={match.matchId} player={player} match={match} /> )
            }
            { !showAll && (playerMatchHistory ?? []).length > 5 && <div className="text-center hover:cursor-pointer hover:bg-midnight2 rounded" onClick={() => setShowAll(!showAll)}>Show All</div>}
        </div>
    )
}