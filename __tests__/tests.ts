// import Manager from '../src/manager'

// test('Manager', (_) => {
//     expect(
//         (function () {
//             const manager = new Manager([], {})
//             return manager.testManager()
//         })()
//     ).toBe(true)
// })

import { ILogger, LogLevel } from 'betterjslogger'

test('LogLevel', () => {
    expect(
        `${LogLevel.ERROR}|${LogLevel.WARN}|${LogLevel.INFO}|${LogLevel.DEBUG}|${LogLevel.VERBOSE}`
    ).toBe('0|1|2|3|4')
})
