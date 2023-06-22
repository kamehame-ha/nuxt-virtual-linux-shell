<template>
<div class="main-wrapper flex flex-col items-center justify-center h-screen">
    <VirtualShell></VirtualShell>
    <div class="feature-buttons mt-6 w-[550px] flex gap-4 items-center">
        <button @click="executeScript()" class="text-green-500 bg-green-500/10 border border-green-500 rounded-md px-2 py-[2px] text-sm cursor-pointer flex shrink-0">Run Command</button>
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
            useVirtualShell().activateScript({
                cmd: {
                    name: 'bash',
                    parameters: 'input.sh',
                    sudo: true
                },
                text: [
                    'Type_S _C[#f87171]_Bpassword_S:'
                ],
                input: {
                    type: 'text',
                    attrs: {
                        placeholder: 'Very strong password'
                    }
                }
            }, ({ finish, input_value, sendComunicate }) => {
                this.text = input_value ?? ''
                sendComunicate('Warning!')
                finish()
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>