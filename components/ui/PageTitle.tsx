import { PageTitleType } from "@/types";
import MyText from "./MyText";

export default function PageTitle({
    title
}: PageTitleType) {
    return (
        <MyText className="text-3xl font-semibold pb-1 pt-1">
            {title}
        </MyText>
    )
}