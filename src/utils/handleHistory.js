

const handleHistory = async (inside, _state) => {
    const history = _state.get('history') || [];
    history.push(inside);
    await _state.update({ history });
};

const getHistory = (_state, k = 15) => {
    const history = _state.get('history') || [];
    const limitHistory = history.slice(-k);
    return limitHistory;
};

const getHistoryParse = (_state, k = 15) => {
    const history = _state.get('history') || [];
    const limitHistory = history.slice(-k);
    return limitHistory.reduce((prev, current) => {
        const msg = current.role === 'user' ? `Customer: "${current.content}"` : `\nSeller: "${current.content}"\n`;
        prev += msg;
        return prev;
    }, '');
};

const clearHistory = async (_state) => {
    _state.clear();
};

module.exports = { handleHistory, getHistory, getHistoryParse, clearHistory };
