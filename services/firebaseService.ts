import { db } from "@/FirebaseConfig";
import { MatchStatusType, NewMatchStateType, NewTournamentStateType, TournamentType } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDocs, increment, orderBy, query, QuerySnapshot, runTransaction, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";

export async function createMatch(
    match: NewMatchStateType,
    tournamentId: string,
    matchId: null | string = null
) {
    if (!matchId) {
        await runTransaction(db, async (transaction) => {
            const matchesRef = doc(collection(db, 'matches'))

            transaction.set(matchesRef, {
                tournamentId,
                gameName: match.gameName,
                round: match.round,
                teamA: {
                    name: match.teamA.name,
                    players: match.teamA.players,
                    score: 0
                },
                teamB: {
                    name: match.teamB.name,
                    players: match.teamB.players,
                    score: 0
                },
                status: 'upcoming',
                winner: null,
                draw: null,
                createdAt: serverTimestamp(),
                startedAt: null,
                completedAt: null
            })

            const tournamentsRef = doc(db, 'tournaments', tournamentId)
            transaction.update(tournamentsRef, {
                remaining_matches: increment(1)
            })

        })
    }
    else {
        const docRef = doc(db, 'matches', matchId)
        await updateDoc(docRef, {
            gameName: match.gameName,
            round: match.round,
            "teamA.name": match.teamA.name,
            "teamA.players": match.teamA.players,
            "teamB.name": match.teamB.name,
            "teamB.players": match.teamB.players,
        })
    }
}


export function getMappedMatchesBySnapshot(snapshot: QuerySnapshot) {
    const updatedMatches = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            tournamentId: data.tournamentId,
            gameName: data.gameName,
            round: data.round,
            teamA: data.teamA,
            teamB: data.teamB,
            status: data.status,
            winner: data.winner,
            draw: data.draw,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            startedAt: data.startedAt ? data.startedAt.toDate() : null,
            completedAt: data.completedAt ? data.completedAt.toDate() : null,
        };
    });

    return updatedMatches
}

export async function updateMatchStatus(id: string | undefined, status: MatchStatusType, tournament: TournamentType | null | undefined, teamA: any = null, teamB: any = null) {
    if (id) {
        const docRef = doc(db, 'matches', id)

        if (status === 'live') {
            await updateDoc(docRef, {
                status,
                startedAt: serverTimestamp()
            })
        }
        else if (status === 'completed') {
            let winner = null
            let draw = false
            if (teamA.score > teamB.score) winner = teamA.name
            else if (teamA.score < teamB.score) winner = teamB.name
            else draw = true

            await updateDoc(docRef, {
                status,
                winner,
                draw,
                completedAt: serverTimestamp()
            })

            if ((teamA && teamB) && tournament) {
                const players = teamA.players + teamB.players
                await updateTournamentStatus(players, tournament)
            }
        }
    }
}

async function updateTournamentStatus(players: string, tournament: TournamentType, isDeleting: boolean = false) {
    const playersCount = Math.max(players.split(',').length, 2)

    const updatedRemainingMatches = tournament.remaining_matches - 1
    let status = tournament.status
    let completedAt = null
    if (updatedRemainingMatches === 0) {
        status = 'completed'
        completedAt = serverTimestamp()
    }

    const tournamentRef = doc(db, 'tournaments', tournament.id)
    if (!isDeleting) {
        await updateDoc(tournamentRef, {
            remaining_matches: increment(-1),
            matches_count: increment(1),
            players_count: increment(playersCount),
            completedAt,
            status
        })
    }
    else {
        await updateDoc(tournamentRef, {
            remaining_matches: increment(-1),
        })
    }
}


export async function updateMatchScore(id: string | undefined, team: string, score: number) {
    if (id) {
        const docRef = doc(db, 'matches', id)
        await updateDoc(docRef, {
            [`${team}.score`]: increment(score),
            startedAt: serverTimestamp()
        })
    }
}


export async function deleteMatchById(id: string | undefined, tournament: TournamentType | null | undefined, players: string | undefined) {
    if (id) {
        const docRef = doc(db, 'matches', id)

        if (players != undefined && tournament) {
            await updateTournamentStatus(players, tournament, true)
        }

        await deleteDoc(docRef)
    }
}

export async function createOrUpdateTournament(
    tournament: NewTournamentStateType,
    tournamentId: string | null = null
) {
    if (!tournamentId) {
        await addDoc(collection(db, 'tournaments'), {
            name: tournament.tournamentName,
            status: 'upcoming',
            remaining_matches: 0,
            matches_count: 0,
            players_count: 0,
            createdAt: serverTimestamp(),
            startedAt: null,
            completedAt: null
        })
    }
    else {
        const docRef = doc(db, 'tournaments', tournamentId)
        await updateDoc(docRef, {
            name: tournament.tournamentName
        })
    }
}


export async function getUpcomingTournaments() {
    const q = query(
        collection(db, 'tournaments'),
        where('status', '==', 'upcoming'),
        orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const allTournaments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            status: data.status,
            remaining_matches: data.remaining_matches,
            matches_count: data.matches_count,
            players_count: data.players_count,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            startedAt: data.startedAt ? data.startedAt.toDate() : null,
            completedAt: data.completedAt ? data.completedAt.toDate() : null,
        };
    });

    return allTournaments
}


export async function getArchivedTournaments() {
    const q = query(
        collection(db, 'tournaments'),
        where('status', '==', 'completed'),
        orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const allTournaments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            status: data.status,
            remaining_matches: data.remaining_matches,
            matches_count: data.matches_count,
            players_count: data.players_count,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            startedAt: data.startedAt ? data.startedAt.toDate() : null,
            completedAt: data.completedAt ? data.completedAt.toDate() : null,
        };
    });

    return allTournaments
}



export async function getTournamentMatchesById(tournamentId: string) {
    let q = query(
        collection(db, 'matches'),
        where('tournamentId', '==', tournamentId),
        orderBy('createdAt', 'desc')
    )
    let snapshot = await getDocs(q)
    const allMatches = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            tournamentId: data.tournamentId,
            gameName: data.gameName,
            round: data.round,
            teamA: data.teamA,
            teamB: data.teamB,
            status: data.status,
            winner: data.winner,
            draw: data.draw,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            startedAt: data.startedAt ? data.startedAt.toDate() : null,
            completedAt: data.completedAt ? data.completedAt.toDate() : null,
        };
    });
    return allMatches
}



export async function liveUpdateTournamentStatus(id: string | undefined) {
    if (id) {
        const docRef = doc(db, 'tournaments', id)

        const q = query(collection(db, 'tournaments'),
            where('status', '==', 'live')
        )

        const snapshot = await getDocs(q)
        if (snapshot.empty) {
            await updateDoc(docRef, {
                status: 'live'
            })
        }
        else {
            return {
                message: 'A tournament is already live',
                error: true
            }
        }
    }
}


export async function deleteTournamentById(id: string | undefined) {
    if(id) {
        const matchesSnap = await getDocs(
            query(collection(db, "matches"), where("tournamentId", "==", id))
        );
    
        const batch = writeBatch(db);
        matchesSnap.forEach((matchDoc) => batch.delete(matchDoc.ref));
    
        batch.delete(doc(db, "tournaments", id));
        await batch.commit()
    }
}