<template>
<div class="shell-wrapper bg-slate-900 px-4 py-4 rounded-2xl w-full md:w-[635px]">
    <div class="shell-navigation-dots flex gap-2">
        <div class="g h-3 w-3 bg-green-400 rounded-full"></div>
        <div class="y h-3 w-3 bg-yellow-400 rounded-full"></div>
        <div @click="startShell" class="r h-3 w-3 bg-red-400 rounded-full cursor-pointer"></div>
    </div>
    <div class="scroll-wrapper w-full">
        <div id="scroll" class="shell flex flex-col gap-[5px] h-[350px] w-full text-white mt-2 font-monospace text-sm overflow-y-hidden">
            <div ref="shell" id="shell" class="shell"></div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { ShellScript, ShellCommand, ShellScriptData, Text, CustomHTML, Input } from '../types/shell'

export default {
    data: () => ({
        shell: {} as HTMLElement,
        user: 'user',
        vm: 'linux',
        dont_interrupt: false,
        folder: [] as Array<string>,
        input_value: null as any,
        initial_done: false
    }),
    methods: {
        async executeScript(script_data: ShellScript) {
            this.input_value = null
            if(Array.isArray(script_data)) {
                const data = script_data as Array<ShellScriptData>
                for (const script of data) {
                    if (script.cmd) {
                        await this.writeCommand(script.cmd as ShellCommand)
                    }

                    if (script.text) {
                        await this.writeText(script.text)
                    }

                    if (script.custom_html) {
                        await this.writeCustomHtml(script.custom_html)
                    }

                    if (script.input) {
                        await this.handleInput(script.input)
                    }

                    if (!script.silent) {
                        useVirtualShell().emitFinish(this.input_value)
                    }
                }
            } else {
                const data = script_data as ShellScriptData
                await this.writeCommand(data.cmd as ShellCommand)

                if(data.text) {
                    await this.writeText(data.text)
                }

                if(data.custom_html) {
                    await this.writeCustomHtml(data.custom_html)
                }

                if(data.input) {
                    await this.handleInput(data.input)
                }
                
                useVirtualShell().emitFinish(this.input_value)
            }
        },
        async writeText(text: Text) {
            // _P add padding, _W add white-space, _B make it bold, _G make it ghost, _I italic, _S split selector

            if (typeof text === 'string') {
                if(text.includes('_S')) {
                    const p = this.shell.appendChild(document.createElement('div'))
                    p.classList.add('output')
                    text.split('_S').forEach(x => {
                        const span = p.appendChild(document.createElement('span'))
                        span.innerHTML = this.parseStringSelectors(x, span)
                    })
                } else {
                    const p = this.shell.appendChild(document.createElement('p'))
                    p.classList.add('output')
                    p.innerHTML = this.parseStringSelectors(text, p)
                }
            } else {
                const texts = text
                for (let text of texts) {
                    if (text.includes('_S')) {
                        const p = this.shell.appendChild(document.createElement('div'))
                        p.classList.add('output')
                        text.split('_S').forEach(x => {
                            const span = p.appendChild(document.createElement('span'))
                            span.innerHTML = this.parseStringSelectors(x, span)
                        })
                    } else {
                        const p = this.shell.appendChild(document.createElement('p'))
                        p.classList.add('output')
                        p.innerHTML = this.parseStringSelectors(text, p)
                    }
                    await this.delay(50)
                }
            }
        },
        async writeCustomHtml(html: CustomHTML) {
            const div = this.shell.appendChild(document.createElement('div'))
            div.innerHTML = html
        },
        async writeCommand(cmd: ShellCommand) {
            const command_prompt = document.getElementById('current') as HTMLElement
            const command = command_prompt.appendChild(document.createElement('div'))
            command.className = 'ml-[5px] flex'

            // Cd if used
            if(cmd.cd) {
                if(cmd.cd.mode === 'open') {
                    if(!cmd.cd.dir) return TypeError(`You need to provide directory in "open" mode`)
                    this.folder.push(cmd.cd.dir)
                } else {
                    if(cmd.cd.go_back_to_default) this.folder = []
                    else this.folder.pop()
                }
            }

            // Typing indication setup
            const typing_indicator = command_prompt.appendChild(document.createElement('div'))
            typing_indicator.className = `start-anim h-[0.875rem] w-[7px] bg-white`
            typing_indicator.id = 'typing'

            // Command text
            const command_name = command.appendChild(document.createElement('p'))
            command_name.className = `font-semibold`
            let cmd_name = `${cmd.sudo ? 'sudo ' : ''}${cmd.name}`
            await this.typeText(cmd_name, command_name)

            // Command params
            if(cmd.parameters) {
                if (typeof cmd.parameters === 'string') {
                    const param = command.appendChild(document.createElement('p'))
                    param.className = `ml-[5px]`
                    await this.typeText((cmd.parameters as string), param, true)
                } else {
                    const params = cmd.parameters as Array<string>
                    for (const x of params) {
                        const param = command.appendChild(document.createElement('p'))
                        param.className = `ml-[5px]`
                        if (params.indexOf(x) === params.length - 1) {
                            await this.typeText(x, param, true)
                        } else await this.typeText(x, param)
                    }
                }
            }
        },
        async handleInput(data: Input) {
            return new Promise((resolve) => {
                const input = this.shell.appendChild(document.createElement('input'))
                input.className = 'bg-transparent border-none outline-none text-white'
                input.type = data.type ?? 'text'
                if (data.attrs) {
                    for (const [key, value] of Object.entries(data.attrs)) {
                        input.setAttribute(key, value)
                    }
                }

                const keyPress = (event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                        input.readOnly = true
                        document.removeEventListener("keypress", keyPress);
                        this.input_value = input.value
                        resolve(null);
                    }
                }

                input.addEventListener('focusin', (e) => {
                    document.addEventListener('keydown', keyPress)
                })

                input.focus()
            })
        },
        async finishScript() {
            const current = document.getElementById('current') as HTMLElement
            if(current) current.id = ''

            // Cd
            let parsed_dir = ''
            if(this.folder.length === 0) parsed_dir = `~`
            else {
                parsed_dir = `~${this.folder.map(x => {
                    if(this.folder.indexOf(x) !== this.folder.length - 1 && this.folder.length > 1) {
                        return `/${x.charAt(0)}`
                    } else return `/${x}`
                }).join('')}`
            }

            const new_prompt = this.shell.appendChild(document.createElement('div'))
            new_prompt.className = 'user-prompt flex items-center'
            new_prompt.id = 'current'
            const user = new_prompt.appendChild(document.createElement('div'))
            user.outerHTML = `<div><span class="text-fuchsia-400 font-semibold">${this.user}</span><span class="font-semibold text-teal-400">@${this.vm}</span>:<span id="folder" class="text-violet-400">${parsed_dir}</span>$</div>`

            this.dont_interrupt = false 
        },
        async typeText(text: string, el: HTMLParagraphElement, kill_indicator?: boolean) {
            const typing_indicator = document.getElementById('typing') as HTMLElement
            typing_indicator.className = `stop-anim h-[0.875rem] w-[7px] bg-white`
            let txt = ''
            let length = text.length
            for (let i =0; i < length; i++) {
                txt = txt + text.charAt(i)
                el.innerText = txt
                if(text.charAt(1) !== ' ') await this.delay(50)
            }
            typing_indicator.className = `start-anim h-[0.875rem] w-[7px] bg-white`
            if(kill_indicator) typing_indicator.remove()
        },
        async delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async startupLogin(user: string, pass: string) {
            // Username
            const user_input = this.shell.appendChild(document.createElement('div'))
            user_input.className = `flex gap-1 items-center`
            user_input.innerHTML = `<p class="">User:</p><p id="username" class="text-blue-400"></p>`
            const username = document.getElementById('username') as HTMLParagraphElement

            await this.delay(500)

            const typing_indicator = user_input.appendChild(document.createElement('div'))
            typing_indicator.className = `start-anim h-[0.875rem] w-[7px] bg-white`
            typing_indicator.id = 'typing'

            await this.typeText(user, username, true)

            await this.delay(500)

            const password_input = this.shell.appendChild(document.createElement('div'))
            password_input.className = `flex gap-1 items-center`
            password_input.innerHTML = `<p class="">Password:</p><p id="password" class="text-red-400"></p>`
            const password = document.getElementById('password') as HTMLParagraphElement

            await this.delay(500)

            const typing_indicator_pass = password_input.appendChild(document.createElement('div'))
            typing_indicator_pass.className = `start-anim h-[0.875rem] w-[7px] bg-white`
            typing_indicator_pass.id = 'typing'

            await this.typeText(pass, password, true)

            await this.delay(500)

            await this.writeText('Awaiting response from host...')

            await this.delay(200)

            await this.writeText('_C[#4ade80]Success!')

            await this.delay(500)

            this.shell.innerHTML = ''
        },
        async startShell() {
            if(this.dont_interrupt) return
            this.dont_interrupt = true

            this.shell.innerHTML = ''

            const { text, info, startupLogin, textModifiers } = useRuntimeConfig().public.virtualShell as any

            if(startupLogin && !this.initial_done) {
                await this.startupLogin(startupLogin.user, startupLogin.password)
            }

            if(text) {
                await this.writeText(text)
            } else {
                const t = [
                    'Welcome to_S _C[#FCC624]_BVirtual Linux Shell _Sfor_S _C[#00DC82]_BNuxt',
                    '_H[https://github.com/kamehame-ha/virtual-linux-shell-nuxt](https://github.com/kamehame-ha/virtual-linux-shell-nuxt)',
                    'Open readme for full guide of configuration & usage_W',
                    '_G_IYou can edit this text through nuxt.config.js'
                ]

                await this.writeText(t)
            }

            if(info) {
                this.vm = info.host
                this.user = info.username
            }
            await this.finishScript()
            useVirtualShell().emitShellLoaded()
        },
        parseStringSelectors(string: string, p: HTMLParagraphElement | HTMLSpanElement) {
            const defaultModifiers = {
                padding: 'pl-8',
                whitespace: {
                    start: '_W',
                    end: '_W'
                },
                ghostText: 'opacity-20',
                bold: 'font-bold'
            }
            const { padding, whitespace, ghostText, bold } = useRuntimeConfig().public.virtualShell.textModifiers ?? defaultModifiers

            let text = string
            if (text.includes('_P')) {
                p.classList.add(padding)
                text = text.replace('_P', '')
            }
            if (text.includes('_B')) {
                p.classList.add(bold)
                text = text.replace('_B', '')
            }
            if (text.includes('_I')) {
                p.classList.add('italic')
                text = text.replace('_I', '')
            }
            if (text.includes('_G')) {
                p.classList.add(ghostText)
                text = text.replace('_G', '')
            }
            if (text.startsWith(whitespace?.start)) {
                p.classList.add('mt-4')
                text = text.replace('_W', '')
            }
            if (text.endsWith(whitespace?.end)) {
                p.classList.add('mb-4')
                text = text.replace('_W', '')
            }

            // hex color

            const regex = /_C\[#([a-fA-F0-9]{6})\]/;
            const match = text.match(regex);

            if(match && match[1]) {
                p.style.color = `#${match[1]}`
                text = text.replace(`_C[#${match[1]}]`, '')
            }

            // hyper link

            const regex2 = /_H\[(.*?)\]\((.*?)\)/;

            const match2 = text.match(regex2)
            if(match2) {
                const name = match2[1];
                const url = match2[2];
                text = text.replace(`_H[${name}](${url})`, '')
                p.outerHTML = `<a class="underline" target="_blank" href="${url}">${name}</a>`
            }

            return text
        }
    },
    async mounted() {
        // Auto scroll
        this.shell = document.getElementById('shell') as HTMLElement
        const scroll = document.getElementById('scroll') as HTMLElement

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                scroll.scrollTop = scroll.scrollHeight
            }
        })

        observer.observe(this.shell)

        this.startShell()
        this.initial_done = true

        useVirtualShell().onStart(async (args) => {
            if (this.dont_interrupt) return
            this.dont_interrupt = true
            scroll.scrollTop = scroll.scrollHeight
            await this.executeScript(args)
        })

        useVirtualShell().onFinish(async (script) => {
            this.dont_interrupt = false
            await this.finishScript()
        })

        useVirtualShell().onCommunicate(async (text) => {
            scroll.scrollTop = scroll.scrollHeight
            await this.writeText(text)
        })
    }
}
</script>

<style>
@keyframes non-typing {
    0% { opacity: 1; }
    49% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 0; }
}

.shell-wrapper .shell .user-prompt .start-anim {
    animation: non-typing 1s infinite;
}

.shell-wrapper .shell .user-prompt .stop-anim {
    animation: none;
}

.shell {
  scrollbar-width: thin;
  scrollbar-color: #fff #0f172a;
}

.shell::-webkit-scrollbar {
  width: 12px;
}

.shell::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 10px;
}

.shell::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  border: none;
}

.shell::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.user-prompt {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.user-prompt > .ml-\[5px\] {
    margin-left: 0;
}

@media (min-width: 750px) {
    .user-prompt {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .user-prompt > .ml-\[5px\] {
        margin-left: 5px;
    }
}

</style>