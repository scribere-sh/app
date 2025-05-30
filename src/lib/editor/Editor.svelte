<script lang="ts" module>
    import { EditorState } from "prosemirror-state";

    export const defaultDocument: object = {
        type: "doc",
        content: [],
    };

    export interface EditorProps {
        doc?: object;
        active?: boolean;
    }
</script>

<script lang="ts">
    // import "prosemirror-view/style/prosemirror.css";

    import { cn } from "$lib/utils";

    // import type { MarkType } from "prosemirror-model";

    import { EditorView } from "prosemirror-view";

    import { baseKeymap, toggleMark } from "prosemirror-commands";
    import { history, redo, undo } from "prosemirror-history";
    import { keymap } from "prosemirror-keymap";

    import { inputRulesPlugin } from "./rules";
    import { schema } from "./schema";

    import { Node } from "prosemirror-model";
    import { onMount } from "svelte";

    let editorRef: HTMLElement;

    let editorState: EditorState;
    let view: EditorView;

    let {
        doc = $bindable(defaultDocument),
        active = false,
    }: EditorProps = $props();

    $effect(() => {
        if (editorState) {
            view.editable = active;
        }
    });

    // $inspect(editorDoc).with((_t, n) => console.log(JSON.stringify(n)));

    // let isSelectionBold = $state(false);
    // let isSelectionItalic = $state(false);

    // const isMarkActive = (state: EditorState, type: MarkType) => {
    //     let { from, $from: _from, to, empty } = state.selection;
    //     if (empty) return !!type.isInSet(state.storedMarks || _from.marks());
    //     else return state.doc.rangeHasMark(from, to, type);
    // };

    onMount(() => {
        console.log($state.snapshot(doc));

        editorState = EditorState.create(
            {
                schema,
                doc: Node.fromJSON(schema, doc),
                plugins: [
                    history(),
                    keymap({
                        "Mod-z": undo,
                        "Mod-y": redo,
                        "Mod-b": toggleMark(schema.marks.strong),
                        "Mod-i": toggleMark(schema.marks.em),
                        "Mod-u": toggleMark(schema.marks.underline),
                    }),
                    keymap(baseKeymap),
                    inputRulesPlugin,
                ],
            },
        );

        view = new EditorView(editorRef, {
            state: editorState,
            editable: () => active,
            dispatchTransaction: (tr) => {
                const new_state = view.state.apply(tr);
                view.updateState(new_state);

                doc = view.state.doc.toJSON();

                // isSelectionBold = isMarkActive(new_state, schema.marks.strong);
                // isSelectionItalic = isMarkActive(new_state, schema.marks.em);
            },
        });

        return () => {
            view.destroy();
        };
    });
</script>

<!--
    <pre>{JSON.stringify({ isSelectionBold, isSelectionItalic }, null, 2)}</pre>
-->

<div
    class={cn(
        "prose dark:prose-invert",
        "prose-headings:text-primary prose-p:text-primary/90 prose-em:text-primary/90 prose-strong:text-primary/90",
        "whitespace-pre-wrap max-w-full w-full active:border-0",
    )}
    bind:this={editorRef}
>
</div>
