<script lang="ts">
    import "../app.css";

    import type { LayoutProps } from "./$types";

    import { ModeWatcher, setTheme } from "mode-watcher";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    import { Toaster } from "$ui/sonner";

    let { children, data }: LayoutProps = $props();

    let disableTransitions = $state(true);

    onMount(() => {
        // FOUC / Transition minimisation on first load
        disableTransitions = false;

        window.setTheme = setTheme;
        window.resetTheme = () => setTheme("default");

        if (data.message) {
            if (data.message.type === "info") {
                toast.info(data.message.content, {
                    position: "top-center",
                });
            } else if (data.message.type === "warning") {
                toast.warning(data.message.content, {
                    position: "top-center",
                });
            } else if (data.message.type === "error") {
                toast.error(data.message.content, {
                    position: "top-center",
                });
            } else {
                toast(data.message.content, {
                    position: "top-center",
                });
            }
        }
    });
</script>

<ModeWatcher defaultTheme="default" {disableTransitions} />

<Toaster richColors />

{@render children()}
