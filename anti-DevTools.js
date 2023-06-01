async function executeFunction() {
    const scrollHeightObserver = value => {
        if (Number.isNaN(value / value) || value === 0) {
            debugger;
        } else {
            setTimeout(() => {
                console.clear();
            }, 100);
        }
        scrollHeightObserver(++value);
    };
    setTimeout(() => scrollHeightObserver(0), 500);
}
setInterval(executeFunction, 1000);
executeFunction();
