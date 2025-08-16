import { View, TouchableOpacity } from 'react-native';
import MyText from './MyText';
import StatusBadge from './StatusBadge';
import GameIcon from './GameIcon';
import { games } from '@/data/games';
import { GameCardType, TeamInfoType } from '@/types';


function TeamInfo({
    winner,
    team,
    completed,
    align = 'left'
}: TeamInfoType) {
    return (
        <View className=''>
            <MyText className={`break-words ${completed ? (winner == team ? 'text-success font-semibold' : 'text-danger font-semibold') : ''}`}
                style={{ textAlign: align }}
            >
                {team}
            </MyText>
            {
                (completed && winner == team) && (
                    <MyText className="break-words" style={{ textAlign: align }}>
                        Winner 🏆
                    </MyText>
                )
            }
        </View>
    )
}


export default function GameCard({
    game,
    onPress
}: GameCardType) {
    const completed = game.winner !== null || game.draw !== null

    const gameIcon = games.find(g => g.name === game.gameName)?.icon
    return (
        <TouchableOpacity
            onPress={() => onPress(game.id)}
            activeOpacity={0.8}
        >
            <View className="w-full rounded-xl bg-card p-4 shadow-sm justify-between gap-4">
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row gap-2'>
                        <GameIcon icon={gameIcon} />

                        <View>
                            <MyText className="font-semibold text-xl">{game.gameName.toUpperCase()}</MyText>
                            <MyText className="opacity-50">{game.round}</MyText>
                        </View>
                    </View>

                    <StatusBadge className={`${game?.status === 'upcoming' ? 'bg-primary' : (game?.status === 'live' ? 'bg-secondary' : 'bg-success')}`} label={game.status.toUpperCase()} />

                </View>

                <View className='flex-row justify-between items-center'>
                    <View className='' style={{ width: '40%' }}>
                        <TeamInfo winner={game.winner} team={game.teamA.name} completed={completed} />
                    </View>

                    <View className='w-20 justify-center items-center'>
                        <MyText className="font-bold text-xl ">
                            {game.teamA.score} - {game.teamB.score}
                        </MyText>
                        {
                            game?.draw && (
                                <MyText className="text-lg" style={{ fontFamily: 'poppins-semibold' }}>
                                    Draw
                                </MyText>
                            )
                        }
                    </View>

                    <View className='' style={{ width: '40%' }}>
                        <TeamInfo winner={game.winner} team={game.teamB.name} completed={completed} align='right' />
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
}
