<script lang="ts" module>
    import { type Command, EditorState } from "prosemirror-state";

    export const defaultDocument: object = {
        type: "doc",
        content: [],
    };

    export interface EditorProps {
        doc?: object;
        active?: boolean;
        onupdate?: (newDoc: object) => void;
    }
</script>

<script lang="ts">
    // import "prosemirror-view/style/prosemirror.css";

    import { cn } from "$lib/utils";

    import { EditorView } from "prosemirror-view";

    import {
        baseKeymap,
        setBlockType,
        toggleMark,
    } from "prosemirror-commands";
    import { history, redo, undo } from "prosemirror-history";
    import { keymap } from "prosemirror-keymap";

    import { inputRulesPlugin } from "./rules";
    import { schema } from "./schema";

    import * as Select from "$ui/select";
    import { Toggle } from "$ui/toggle";

    import Bold from "@lucide/svelte/icons/bold";
    import Italic from "@lucide/svelte/icons/italic";
    import Underline from "@lucide/svelte/icons/underline";

    import { MarkType, Node } from "prosemirror-model";
    import { onMount } from "svelte";

    let editorRef: HTMLElement;

    let editorState: EditorState;
    let view: EditorView;

    let {
        doc = $bindable(defaultDocument),
        active = false,
        onupdate,
    }: EditorProps = $props();

    // $effect(() => {
    //     if (view) {
    //         view.editable = active;
    //     }
    // });

    const dispatchCommand: (
        command: Command,
    ) => (ev?: Event | unknown) => void = (command) => {
        return (ev) => {
            // toggles moment
            if (ev && ev instanceof Event) ev.preventDefault();

            const { state, dispatch } = view;
            if (command(state, dispatch)) {
                view.focus();
            }
        };
    };

    // $inspect(editorDoc).with((_t, n) => console.log(JSON.stringify(n)));

    let isSelectionBold = $state(false);
    let isSelectionItalic = $state(false);
    let isSelectionUnderline = $state(false);

    let currentActiveBlock: string | undefined = $state(undefined);

    const currentActiveBlockHumanReadable = (
        blockType: string | undefined,
    ) => {
        switch (blockType) {
            case "h1":
                return "Heading 1";
            case "h2":
                return "Heading 2";
            case "h3":
                return "Heading 3";
            case "h4":
                return "Heading 4";
            case "h5":
                return "Heading 5";
            case "h6":
                return "Heading 6";
            case "p":
                return "Normal Text";

            default:
                return "Unknown";
        }
    };

    const blockNameToBlockSchema = (blockType: string) => {
        switch (blockType) {
            case "h1":
                return setBlockType(schema.nodes.heading, { level: 1 });
            case "h2":
                return setBlockType(schema.nodes.heading, { level: 2 });
            case "h3":
                return setBlockType(schema.nodes.heading, { level: 3 });
            case "h4":
                return setBlockType(schema.nodes.heading, { level: 4 });
            case "h5":
                return setBlockType(schema.nodes.heading, { level: 5 });
            case "h6":
                return setBlockType(schema.nodes.heading, { level: 6 });
            case "p":
                return setBlockType(schema.nodes.paragraph);
            default:
                throw new Error("Unknown Block Type");
        }
    };

    const selectionNodetoNodeType = (n: Node) => {
        const name = n.type.name;
        const attrs = n.attrs;

        if (name === "heading" && "level" in attrs) {
            currentActiveBlock = `h${attrs.level}`;
        } else if (name === "paragraph") {
            currentActiveBlock = "p";
        } else {
            currentActiveBlock = undefined;
        }
    };

    // $inspect(isSelectionBold, isSelectionItalic);

    const isMarkActive = (state: EditorState, type: MarkType) => {
        let { from, $from: _from, to, empty } = state.selection;
        if (empty) {
            return !!type.isInSet(state.storedMarks || _from.marks());
        } else return state.doc.rangeHasMark(from, to, type);
    };

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

                if (onupdate) onupdate(view.state.doc.toJSON());

                isSelectionBold = isMarkActive(
                    new_state,
                    schema.marks.strong,
                );
                isSelectionItalic = isMarkActive(
                    new_state,
                    schema.marks.em,
                );
                isSelectionUnderline = isMarkActive(
                    new_state,
                    schema.marks.underline,
                );

                selectionNodetoNodeType(
                    new_state.selection.$anchor.parent,
                );
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

{#if active}
    <div class="w-full mb-4 flex flex-row items-center gap-2 px-2">
        <Select.Root
            type="single"
            value={currentActiveBlock}
            onValueChange={(val) => {
                const command = blockNameToBlockSchema(val);
                const { state, dispatch } = view;
                if (command(state, dispatch)) {
                    view.focus();
                }
            }}
        >
            <Select.Trigger placeholder="Unknown" class="w-48">
                {
                    currentActiveBlockHumanReadable(
                        currentActiveBlock,
                    )
                }
            </Select.Trigger>
            <Select.Content class="">
                <Select.Group>
                    <Select.Item value="h1">
                        {
                            currentActiveBlockHumanReadable(
                                "h1",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="h2">
                        {
                            currentActiveBlockHumanReadable(
                                "h2",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="h3">
                        {
                            currentActiveBlockHumanReadable(
                                "h3",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="h4">
                        {
                            currentActiveBlockHumanReadable(
                                "h4",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="h5">
                        {
                            currentActiveBlockHumanReadable(
                                "h5",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="h6">
                        {
                            currentActiveBlockHumanReadable(
                                "h6",
                            )
                        }
                    </Select.Item>

                    <Select.Item value="p">
                        {
                            currentActiveBlockHumanReadable(
                                "p",
                            )
                        }
                    </Select.Item>
                </Select.Group>
            </Select.Content>
        </Select.Root>

        <Toggle
            variant="outline"
            aria-label="toggle bold"
            bind:pressed={isSelectionBold}
            onclick={dispatchCommand(toggleMark(schema.marks.strong))}
        >
            <Bold />
        </Toggle>

        <Toggle
            variant="outline"
            aria-label="toggle italic"
            bind:pressed={isSelectionItalic}
            onclick={dispatchCommand(toggleMark(schema.marks.em))}
        >
            <Italic />
        </Toggle>

        <Toggle
            variant="outline"
            aria-label="toggle underline"
            bind:pressed={isSelectionUnderline}
            onclick={dispatchCommand(toggleMark(schema.marks.underline))}
        >
            <Underline />
        </Toggle>
    </div>
{/if}

<div
    class={cn(
        "prose dark:prose-invert",
        "prose-headings:text-primary prose-p:text-primary/90 prose-em:text-primary/90 prose-strong:text-primary/90",
        "whitespace-pre-wrap max-w-full w-full active:border-0",
    )}
    bind:this={editorRef}
>
</div>
