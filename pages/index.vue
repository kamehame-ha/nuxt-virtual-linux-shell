<template>
    <div class="main-wrapper flex flex-col items-center justify-center pt-[125px] bg-slate-800 px-[25px] md:px-0">
        <div class="text flex flex-col gap-0 max-w-[525px] mb-[15px]">
            <p class="text-white text-center text-lg font-medium">This is the live preview of Virtual Linux Shell</p>
            <p class="text-white font-light text-center">Vue 3 component that looks just like ubuntu bash, component itself only simulates behavior of actual shell giving you various options of graphical representation for your website functions</p>
            <p class="text-gray-500 mt-[5px] italic text-center">Hint: You can clear console using red dot</p>
        </div>
        <VirtualShell></VirtualShell>
        <div class="text flex flex-col gap-0 max-w-[525px] mt-[15px]">
            <p class="text-white font-light text-center">Use buttons to execute different commands</p>
        </div>
        <div class="buttons mt-[15px] flex flex-wrap gap-3 px-[25px] items-center justify-center max-w-[800px]">
            <button @click="cdProjects" class="text-blue-500 bg-blue-500/10 border border-blue-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">cd projects</button>
            <button @click="cdCurrentProject" class="text-blue-500 bg-blue-500/10 border border-blue-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">cd current-project</button>
            <button @click="cdGoBack" class="text-blue-500 bg-blue-500/10 border border-blue-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">cd ..</button>
            <button @click="parameters" class="text-pink-500 bg-pink-500/10 border border-pink-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command with parameters</button>
            <button @click="sudo" class="text-red-500 bg-red-500/10 border border-red-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command with sudo</button>
            <button @click="textFormatting" class="text-green-500 bg-green-500/10 border border-green-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Text formatting</button>
            <button @click="input" class="text-indigo-500 bg-indigo-500/10 border border-indigo-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command with input</button>
            <button @click="customHTML" class="text-teal-500 bg-teal-500/10 border border-teal-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Custom html command</button>
            <button @click="silent" class="text-orange-500 bg-orange-500/10 border border-orange-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Silent command (multi command)</button>
        </div>
        <div class="text flex flex-col gap-0 max-w-[525px] mt-[15px]">
            <p class="text-white font-light text-center">Building scripts is easy thanks to composable:</p>
            <div class="script mt-[10px] bg-slate-700/25 rounded-md px-[25px] py-[15px] font-monospace font-medium text-sm">
                <div class="line text-gray-500">// cd projects command</div>
                <div class="line text-green-400">cdProject<span class="text-white">() {</span></div>
                <div class="line pl-[30px] text-green-400">useVirtualShell<span class="text-white">().</span>executeScript<span class="text-white">({</span></div>
                <div class="line pl-[60px] text-white">cmd<span class="text-pink-400">:</span> <span class="text-cyan-400">{</span></div>
                <div class="line pl-[90px] text-white">name<span class="text-pink-400">:</span> <span class="text-yellow-300">'cd'</span>,</div>
                <div class="line pl-[90px] text-white">parameters<span class="text-pink-400">:</span> <span class="text-yellow-300">'projects'</span>,</div>
                <div class="line pl-[90px] text-white">cd<span class="text-pink-400">:</span> <span class="text-purple-400">{</span></div>
                <div class="line pl-[120px] text-white">dir<span class="text-pink-400">:</span> <span class="text-yellow-300">'projects'</span>,</div>
                <div class="line pl-[120px] text-white">mode<span class="text-pink-400">:</span> <span class="text-yellow-300">'open'</span>,</div>
                <div class="line pl-[90px] text-white"><span class="text-purple-400">}</span></div>
                <div class="line pl-[60px] text-white"><span class="text-cyan-400">}</span></div>
                <div class="line pl-[30px] text-green-400"><span class="text-white">}, ({ <span class="text-green-400">finish</span> }) <span class="text-pink-400">=></span> {</span></div>
                <div class="line pl-[60px] text-green-400">finish<span class="text-cyan-400">()</span></div>
                <div class="line pl-[30px] text-white">})</div>
                <div class="line text-white">}</div>
            </div>
        </div>
        <div class="text flex gap-[10px] items-center max-w-[525px] mt-[15px]">
            <p class="text-white font-light text-center">For more info checkout:</p>
            <a target="_blank" href="https://github.com/kamehame-ha/nuxt-virtual-linux-shell?tab=readme-ov-file#documentation">
                <button class="text-purple-500 bg-purple-500/10 border border-purple-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Docs</button>
            </a>
        </div>
        <div class="footer flex pt-[125px] pb-[25px] text-white text-sm">Created by kameHame HA - All rights reserved © 2025</div>
    </div>
</template>

<script lang="ts">
export default {
    data: () => ({
        text: ''
    }),
    methods: {
        cdProjects() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'cd',
                    parameters: 'projects',
                    cd: {
                        dir: 'projects',
                        mode: 'open'
                    }
                }
            }, ({ finish }) => {
                finish()
            })
        },
        cdCurrentProject() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'cd',
                    parameters: 'current-project',
                    cd: {
                        dir: 'current-project',
                        mode: 'open'
                    }
                }
            }, ({ finish }) => {
                finish()
            })
        },
        cdGoBack() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'cd',
                    parameters: '..',
                    cd: {
                        mode: 'go-back'
                    }
                }
            }, ({ finish }) => {
                finish()
            })
        },
        parameters() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'parameters.sh',
                    parameters: ['param1', 'param2', 'param3'],
                }
            }, ({ finish }) => {
                finish()
            })
        },
        sudo() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'wget',
                    parameters: 'https://kame.pro',
                    sudo: true
                }
            }, ({ finish }) => {
                finish()
            })
        },
        textFormatting() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'nano',
                    parameters: 'text-style.txt',
                    sudo: false
                },
                text: [
                    '_PPadding',
                    '_WWhitespace on top',
                    '_BBold',
                    '_IItalic',
                    '_GGhost text',
                    '_C[#f472b6]Colored text',
                    '_H[Url Markdown](https://github.com/kamehame-ha)',
                    '_BText_S _I_C[#818cf8]styled with split'
                ]
            }, ({ finish }) => {
                finish()
            })
        },
        input() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'bash',
                    parameters: 'login.sh',
                    sudo: true
                },
                input: {
                    attrs: {
                        placeholder: 'Use enter to accept...'
                    }
                }
            }, ({ finish, sendCommunicate, input_value }) => {
                sendCommunicate(`You typed : _S_C[#4ade80]_B${input_value}`)
                finish()
            })
        },
        customHTML() {
            useVirtualShell().executeScript({
                cmd: {
                    name: 'wget',
                    parameters: '/avatar.png',
                },
                text: 'Custom HTML can be used to for example display images inside shell',
                custom_html: '<img src="/avatar.png" class="h-[50px] w-{50px}">'
            }, ({ finish }) => {
                finish()
            })
        },
        silent() {
            useVirtualShell().executeScript([
                {
                    cmd: {
                        name: 'bash',
                        parameters: 'silent.sh'
                    },
                    text: '_GCommand 1 _SSilent command includes multiple number of separated commands',
                    silent: true,
                    custom_html: '<button class="text-orange-500 bg-orange-500/10 border border-orange-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command 1</button>'
                },
                {
                    text: '_GCommand 2 _SEach one of them will be executed one after another',
                    silent: true,
                    custom_html: '<button class="text-blue-500 bg-blue-500/10 border border-blue-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command 2</button>'
                },
                {
                    text: '_GCommand 3 _SIts the easiest way to manipulate order or just pumping more functions to one clean script',
                    custom_html: '<button class="text-red-500 bg-red-500/10 border border-red-500 rounded-md px-2 pb-[2px] pt-[5px] text-sm leading-[20px] cursor-pointer flex shrink-0">Command 3</button>'
                },
            ], ({ finish, sendCommunicate }) => {
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
                        '_H[readme.md](https://github.com/kamehame-ha/nuxt-virtual-linux-shell?tab=readme-ov-file#documentation)_S < check out docs',
                    ],
                }
            ], ({ finish }) => {
                finish()
            })
        })
    }
}
</script>