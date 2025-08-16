import { View } from "react-native";
import PageTitle from "./ui/PageTitle";
import MyText from "./ui/MyText";
import TournamentCard from "./ui/TournamentCard";
import { TournamentsSectionType } from "@/types";

export default function TournamentsSection({
    title,
    tournaments,
    onCardClick,
    matchesLoading = false,
    titleVisible = true
}: TournamentsSectionType) {
    return (
        <View className="p-4 gap-4">
            {
                titleVisible && (
                    <PageTitle title={title} />
                )
            }

            <View className="gap-4">

                {
                    (tournaments.length == 0 || matchesLoading) ? (
                        <MyText>Nothing to show up here</MyText>
                    ) : (
                        tournaments.map((t, index) => (
                            <TournamentCard
                                key={index}
                                tournament={t}
                                onPress={onCardClick}
                            />
                        ))
                    )
                }
            </View>
        </View>
    )
}