import { ShellScript, Text } from '../types/shell'

export const useVirtualShell = () => {
    function finishScript(script?: ShellScript) {
        useEventEmitter().emit('finish-script', script)
    }

    function activateScript(script: ShellScript, callback: (options: {finish: (s?: ShellScript) => void, script_data?: ShellScript, input_value?: string, sendComunicate: (t: Text) => void}) => void) {
        useEventEmitter().emit('start-script', script)

        useEventEmitter().off('script-finished')

        useEventEmitter().on('script-finished', (input_data) => {
            return callback({
                finish: finishScript,
                input_value: input_data,
                script_data: script,
                sendComunicate: emitComunicate
            })
        })
    }


 
    function onFinish(callback: (script: ShellScript) => void) {
        useEventEmitter().on('finish-script', (script) => {
            return callback(script)
        })
    }

    function onStart(callback: (script: ShellScript) => void) {
        useEventEmitter().off('start-script')

        useEventEmitter().on('start-script', (script) => {
            return callback(script)
        })
    }

    function onComunicate(callback: (text: Text) => void) {
        useEventEmitter().off('print-comunicate')

        useEventEmitter().on('print-comunicate', (text) => {
            return callback(text)
        })
    }

    function emitComunicate(text: Text) {
        useEventEmitter().emit('print-comunicate', text)
    }

    function emitFinish(input_value?: any) {
        useEventEmitter().emit('script-finished', input_value ?? null)
    }

    return {
        activateScript, onStart, onFinish, emitFinish, onComunicate
    }
}