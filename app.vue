<template>
    <div class="main-wrapper flex flex-col items-center justify-center h-screen bg-slate-800">
        <VirtualShell></VirtualShell>
        <div class="feature-buttons mt-6 w-[550px] flex gap-4 items-center">
            <button @click="executeScript()"
                class="text-green-500 bg-green-500/10 border border-green-500 rounded-md px-2 py-[2px] text-sm cursor-pointer flex shrink-0">Run
                Command</button>
            <p class="output text-sm text-white">Ouput: <span class="text-green-400">{{ text }}</span></p>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data: () => ({
        text: ''
    }),
    methods: {
        executeScript() {
            useVirtualShell().executeScript([
                {
                    cmd: {
                        name: 'bash',
                        parameters: 'silent.sh'
                    },
                    text: '1',
                    silent: true
                },
                {
                    text: '2',
                    silent: true
                },
                {
                    text: '3',
                },
            ], ({ finish, sendComunicate }) => {
                finish()
            })
        }
    }
}
</script>