<template>
    <div class="main-wrapper flex flex-col items-center justify-center h-screen bg-slate-800">
        <VirtualShell></VirtualShell>
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
            ], ({ finish, sendCommunicate }) => {
                sendCommunicate('_G_ICommunicate: This command is made out from 3 separated commands')
                finish()
            })
        }
    },
    mounted() {
        useVirtualShell().onShellLoad(() => {
            useVirtualShell().executeScript([
                {
                    cmd: {
                        name: 'bash',
                        parameters: 'welcome-script.sh'
                    },
                    text: [
                        '_C[#c084fc]_BHello new user!',
                        '_GUse buttons below to navigate through page'
                    ],
                    silent: true
                },
                {
                    custom_html: '<p class="buttons">Buttons!!!</p>'
                }
            ], ({ finish }) => {
                finish()
            })
        })
    }
}
</script>