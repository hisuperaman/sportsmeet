import { ActivityIndicator, View } from "react-native";
import PageTitle from "./ui/PageTitle";
import MyText from "./ui/MyText";
import GameCard from "./ui/GameCard";
import { MatchesSectionType } from "@/types";

export default function MatchesSection({
    title,
    matches,
    onMatchClick,
    matchesLoading = false,
    showLoader = false,
    titleVisible = true
}: MatchesSectionType) {
    return (
        <View className="p-4 gap-4">
            {
                titleVisible && (
                    <PageTitle title={title} />
                )
            }

            <View className="gap-4">

                {
                    (matchesLoading && showLoader) ? (
                        <ActivityIndicator size={'large'} color={'black'} />
                    ) : (
                        (matches.length == 0 || matchesLoading) ? (
                            <MyText>Nothing to show up here</MyText>
                        ) : (
                            matches.map((match, index) => (
                                <GameCard
                                    key={index}
                                    game={match}
                                    onPress={onMatchClick}
                                />
                            ))
                        )
                    )
                }
            </View>
        </View>
    )
}