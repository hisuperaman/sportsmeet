import { View, TouchableOpacity } from 'react-native';
import MyText from './MyText';
import StatusBadge from './StatusBadge';
import GameIcon from './GameIcon';
import { TournamentCardType, TournamentMetaInfoType } from '@/types';

function TournamentMetaInfo({
    label,
    value
}: TournamentMetaInfoType) {
    return (
        <View className='items-center'>
            <MyText className="text-primary text-2xl font-semibold">
                {value}
            </MyText>
            <MyText className="text-xs">
                {label}
            </MyText>
        </View>
    )
}

export default function TournamentCard({
    tournament,
    onPress
}: TournamentCardType) {

    let formattedDate = 'NA'
    if (tournament.createdAt && tournament.createdAt instanceof Date) {
        formattedDate = tournament.createdAt.getFullYear().toString().substring(2)
    }
    return (
        <TouchableOpacity
            onPress={() => onPress(tournament?.id)}
            activeOpacity={0.8}
        >
            <View className="w-full rounded-xl bg-card p-4 shadow-md justify-between gap-4">
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row gap-2 items-center' style={{ width: '70%' }}>
                        <GameIcon icon={formattedDate} />


                        <MyText className="font-semibold text-xl w-[75%]">{tournament?.name}</MyText>
                    </View>

                    <StatusBadge className={`${tournament?.status === 'upcoming' ? 'bg-primary' : (tournament?.status === 'live' ? 'bg-secondary' : 'bg-success')}`} label={tournament?.status.toUpperCase()} />
                </View>

                {/* <View className='flex-row justify-between'>
                    <ArchiveMetaInfo label={'MATCHES'} value={archive?.matchesCount} />
                    <ArchiveMetaInfo label={'PLAYERS'} value={archive?.players} />
                </View> */}
            </View>
        </TouchableOpacity>
    );
}
