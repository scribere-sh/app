import { englishDataset, englishRecommendedTransformers, RegExpMatcher, TextCensor } from "obscenity";

export const profanityMatcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

export const profanityCensor = new TextCensor();
