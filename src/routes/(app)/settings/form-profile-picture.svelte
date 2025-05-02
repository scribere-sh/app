<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormProfilePictureProps {
        form: PageData["details"]["updateProfilePicutreForm"];
    }
</script>

<script lang="ts">
    import { getContext } from "svelte";

    import { fileProxy, superForm } from "sveltekit-superforms";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";

    import { route } from "$lib/routes";

    const csrf = getContext<string>("csrf");

    const { form: _form }: FormProfilePictureProps = $props();

    const form = superForm(_form, {});

    const files = fileProxy(form, "image");

    const { enhance } = form;
</script>

<form
    method="POST"
    action={route("updateProfilePicture /settings")}
    enctype="multipart/form-data"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf}>

    <Form.Field {form} name="image">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Update Profile Picture</Form.Label>
                <Input
                    {...props}
                    type="file"
                    accept="image/*"
                    required
                    bind:files={$files}
                />
                <Form.FieldErrors />
            {/snippet}
        </Form.Control>
    </Form.Field>

    <Form.Button>
        Upload
    </Form.Button>
</form>
