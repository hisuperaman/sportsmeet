import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FieldValue } from 'firebase/firestore';

export type MatchStatusType = 'upcoming' | 'live' | 'completed' | 'paused';
export type TournamentStatusType = 'upcoming' | 'live' | 'completed' | 'paused';

export type MatchType = {
    id: string
    gameName: string;
    round: string;
    teamA: {
        name: string;
        players: string;
        score: number;
    };
    teamB: {
        name: string;
        players: string;
        score: number;
    };
    status: MatchStatusType;
    winner: string | null
    draw: boolean | null
    createdAt: FieldValue;
    startedAt: FieldValue | null;
    completedAt: FieldValue | null;
};

export type NewMatchStateType = {
    gameName: string;
    round: string;
    teamA: {
        name: string;
        players: string;
    };
    teamB: {
        name: string;
        players: string;
    };
};


export type InputType = {
    label: string
    value: string
    onChange: (text: string) => void
    placeholder?: string
    secureTextEntry?: boolean
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined
}

export type SettingCardType = {
    label: string
    onPress: () => void
    isLoading?: boolean
}

export type ActionButtonType = {
    label: string
    color: string
    onPress: () => void
    disabled?: boolean
}

export type TeamScoreAdminType = {
    name: string
    score: number
    onScoreUpdate: (name: string, score: number) => void
    winner?: string | null
    completed?: boolean | null
    editable?: boolean
}

export type TeamScoreType = {
    name: string
    score: number
    winner?: string | null
    completed?: boolean | null
}

type TextAlignType = 'left' | 'right' | 'center'

export type TeamMembersType = {
    members: string
    align?: TextAlignType
}

export type TournamentMetaInfoType = {
    label: string
    value: number
}


export type ButtonType = {
    label: string
    onPress: () => void
    isDanger?: boolean
    isLoading?: boolean
    outline?: boolean
}

export type TeamInfoType = {
    winner: string | null
    team: string
    completed: boolean | null
    align?: TextAlignType
}

export type GameCardType = {
    game: MatchType,
    onPress: (id: string) => void
}

export type GameIconType = {
    icon?: string
}

export type PageTitleType = {
    title: string
}

export type StatusBadgeType = {
    label: string
    className: string
}

export type MatchesSectionType = {
    title: string
    matches: MatchType[]
    onMatchClick: (id: string) => void
    matchesLoading: boolean,
    showLoader?: boolean
    titleVisible?: boolean
}

export type IconButtonType = {
    icon: any
    onPress: () => void
}


export type ScoreLayoutAdminType = {
    match: MatchType
    completed: boolean
    editable: boolean
    onScoreUpdate: (name: string, score: number) => void
    onStatusChange: () => void
    isLoading: boolean,
    upcomingTournament: boolean
}

export type ScoreLayoutType = {
    match: MatchType
    completed: boolean
}

export type NewTournamentStateType = {
    tournamentName: string;
}

export type TournamentType = {
    id: string,
    name: string
    status: TournamentStatusType
    remaining_matches: number
    matches_count: number,
    players_count: number
    createdAt: FieldValue
    startedAt: FieldValue | null
    completedAt: FieldValue | null
}

export type TournamentsSectionType = {
    title: string,
    tournaments: TournamentType[]
    onCardClick: (id: string) => void
    matchesLoading?: boolean
    titleVisible?: boolean
}

export type TournamentCardType = {
    tournament: TournamentType,
    onPress: (id: string) => void
}

export type FloatingButtonType = {
    icon: IconDefinition,
    onPress: () => void,
    isLoading?: boolean,
    cls?: string,
    isSmall?: boolean
}


export type ExtraActionsType = {
    onDelete: () => void
    onEdit: () => void
    isDeleting?: boolean
}