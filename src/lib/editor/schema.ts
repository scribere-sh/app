import type { Mark, MarkSpec, NodeSpec, SchemaSpec } from "prosemirror-model";
import { Schema } from "prosemirror-model";

const spec: SchemaSpec = {
    nodes: {
        // #region Block Nodes

        doc: {
            content: "block+",
        },

        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            toDOM: () => ["p", 0],
        },

        heading: {
            attrs: {
                level: {
                    default: 1,
                    validate: "number",
                },
            },
            content: "inline*",
            group: "block",
            defining: true,
            parseDOM: [
                { tag: "h1", attrs: { level: 1 } },
                { tag: "h2", attrs: { level: 2 } },
                { tag: "h3", attrs: { level: 3 } },
                { tag: "h4", attrs: { level: 4 } },
                { tag: "h5", attrs: { level: 5 } },
                { tag: "h6", attrs: { level: 6 } },
            ],
            toDOM: (node) => ["h".concat(node.attrs.level.toString()), 0],
        },

        // #endregion
        // #region Inline Nodes

        text: {
            inline: true,
            group: "inline",
        },

        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{ tag: "br" }],
            toDOM: () => ["br"],
        },
        // #endregion
    } satisfies Record<string, NodeSpec>,

    // #region Marks

    marks: {
        link: {
            attrs: {
                href: { validate: "string" },
                title: { default: null, validate: "string|null" },
            },
            inclusive: false,
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs: (node: HTMLElement) => {
                        return {
                            href: node.getAttribute("href"),
                            title: node.getAttribute("title"),
                        };
                    },
                },
            ],
            toDOM: (node) => {
                const { href, title } = node.attrs;
                return ["a", { href, title }, 0];
            },
        },

        em: {
            parseDom: [
                { tag: "i" },
                { tag: "em" },
                { style: "font-style=italic" },
                { style: "font-style=normal", clearMark: (m: Mark) => m.type.name === "em" },
            ],
            toDOM: () => ["em", 0],
        },

        strong: {
            parseDOM: [
                { tag: "strong" },
                // Workaround for Google Docs
                { tag: "b", getAttrs: (node) => node.style.fontWeight != "normal" && null },
                { style: "font-weight=400", clearMark: (m: Mark) => m.type.name === "strong" },
                { style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
            ],
            toDOM: () => ["strong", 0],
        },

        underline: {
            parseDOM: [
                { style: "text-decoration=underline" },
            ],
            toDOM: () => ["span", { style: "text-decoration: underline" }, 0],
        },
    } satisfies Record<string, MarkSpec>,

    // #endregion

    topNode: "doc",
};

export const schema = new Schema(spec);
