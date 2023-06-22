type InputType = 'text' | 'password' | 'number' | 'email' | 'url' | 'phone'

interface Cd {
    mode: 'open' | 'go-back'
    dir?: string,
    go_back_to_default?: boolean
}

interface ShellCommand {
    name: string
    parameters?: string | Array<string>
    sudo?: boolean
    cd?: Cd
}

type Text = string | Array<string> 

type CustomHTML = string

type InputAttrs = { [param_name: string]: any }

interface Input  {
    id?: string
    type?: InputType
    attrs?: InputAttrs
}

export interface ShellScriptData {
    cmd?: ShellCommand
    text?: Text
    custom_html?: CustomHTML
    input?: Input
    silent?: boolean
}

export { ShellCommand, Input, Cd, Text, CustomHTML, InputAttrs, InputType }
export type ShellScript = ShellScriptData | Array<ShellScriptData>