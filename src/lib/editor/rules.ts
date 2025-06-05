import { ellipsis, InputRule, inputRules } from "prosemirror-inputrules";
import { schema } from "./schema";

const headingRule = new InputRule(/^#{1,6} $/, (state, _match, start, end) => {
    return state.tr
        .setBlockType(start, end, schema.nodes.heading, { level: end - start })
        .deleteRange(start, end);
});

const boldItalicRule = new InputRule(/([*_]{1,3})[^*_]+([*_]{1,3})/, (state, match, start, end) => {
    if (match.length != 3) return null;

    const { 1: prefix, 2: suffix } = match;
    if (prefix.length != suffix.length) return null;

    let tr = state.tr;

    if (prefix.length !== 2) {
        tr = tr.addMark(start, end, schema.marks.em.create());
    }

    if (prefix.length > 1) {
        tr = tr.addMark(start, end, schema.marks.strong.create());
    }

    tr = tr
        .deleteRange(end - (suffix.length - 1), end)
        .deleteRange(start, start + prefix.length);

    return tr;
});

export const inputRulesPlugin = inputRules({
    rules: [ellipsis, headingRule, boldItalicRule],
});
