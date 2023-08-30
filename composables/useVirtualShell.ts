import { ShellScript, Text } from '../types/shell'

export const useVirtualShell = () => {
    function finishScript(script?: ShellScript) {
        useEventEmitter().emit('finish-script', script)
    }

    function executeScript(script: ShellScript, callback: (options: {finish: (s?: ShellScript) => void, script_data?: ShellScript, input_value?: string, sendCommunicate: (t: Text) => void}) => void) {
        useEventEmitter().emit('start-script', script)

        useEventEmitter().off('script-finished')

        useEventEmitter().on('script-finished', (input_data) => {
            return callback({
                finish: finishScript,
                input_value: input_data,
                script_data: script,
                sendCommunicate: emitCommunicate
            })
        })
    }

    function onShellLoad(callback: () => void) {        
        useEventEmitter().on('shell-loaded', () => {
            return callback()
        })
    }


    function emitShellLoaded() {
        useEventEmitter().emit('shell-loaded')
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

    function onCommunicate(callback: (text: Text) => void) {
        useEventEmitter().off('print-communicate')

        useEventEmitter().on('print-communicate', (text) => {
            return callback(text)
        })
    }

    function emitCommunicate(text: Text) {
        useEventEmitter().emit('print-communicate', text)
    }

    function emitFinish(input_value?: any) {
        useEventEmitter().emit('script-finished', input_value ?? null)
    }

    return {
        executeScript, onStart, onFinish, emitFinish, onCommunicate, onShellLoad, emitShellLoaded
    }
}