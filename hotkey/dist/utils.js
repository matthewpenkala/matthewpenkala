export function isFormField(element) {
    if (!(element instanceof HTMLElement)) {
        return false;
    }
    const name = element.nodeName.toLowerCase();
    const type = (element.getAttribute('type') || '').toLowerCase();
    return (name === 'select' ||
        name === 'textarea' ||
        (name === 'input' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'checkbox' &&
            type !== 'radio' &&
            type !== 'file') ||
        element.isContentEditable);
}
export function fireDeterminedAction(el, path) {
    const delegateEvent = new CustomEvent('hotkey-fire', { cancelable: true, detail: { path } });
    const cancelled = !el.dispatchEvent(delegateEvent);
    if (cancelled)
        return;
    if (isFormField(el)) {
        el.focus();
    }
    else {
        el.click();
    }
}
export function expandHotkeyToEdges(hotkey) {
    const output = [];
    let acc = [''];
    let commaIsSeparator = false;
    for (let i = 0; i < hotkey.length; i++) {
        if (commaIsSeparator && hotkey[i] === ',') {
            output.push(acc);
            acc = [''];
            commaIsSeparator = false;
            continue;
        }
        if (hotkey[i] === ' ') {
            acc.push('');
            commaIsSeparator = false;
            continue;
        }
        else if (hotkey[i] === '+') {
            commaIsSeparator = false;
        }
        else {
            commaIsSeparator = true;
        }
        acc[acc.length - 1] += hotkey[i];
    }
    output.push(acc);
    return output.map(h => h.filter(k => k !== '')).filter(h => h.length > 0);
}
