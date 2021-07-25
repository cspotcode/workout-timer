$(() => {
    class Timer {
        constructor(selector) {
            this.tickerInterval = null;
            this.secRemaining = 0;
            this._finished = false;
            this.$wrap = $(selector);
            this.$root = this.$wrap.find('.timerRoot');
            this.$minInput = this.$wrap.find('.minInput');
            this.$secInput = this.$wrap.find('.secInput');
            this.$timeReadout = this.$wrap.find('.timeReadout');
            this.$startPauseButton = this.$wrap.find('.startPauseButton');
            this.$startPauseButton.on('click', this.onStartPause.bind(this));
            this.$resetButton = this.$wrap.find('.resetButton');
            this.$resetButton.on('click', this.onReset.bind(this));
            this.renderReadout();
        }
        get minInput() {
            const a = +this.$minInput.val();
            return Number.isNaN(a) ? 0 : a;
        }
        set minInput(v) {
            this.$minInput.val(v);
        }
        get secInput() {
            const a = +this.$secInput.val();
            return Number.isNaN(a) ? 0 : a;
        }
        set secInput(v) {
            this.$secInput.val(v);
        }
        get min() {
            const a = this.secRemaining / 60;
            return a > 0 ? Math.floor(a) : Math.ceil(a);
        }
        get sec() {
            return this.secRemaining % 60;
        }
        get finished() {
            return this._finished;
        }
        set finished(v) {
            this._finished = v;
            const className = 'finished';
            if (v)
                this.$root.addClass(className);
            else
                this.$root.removeClass(className);
        }
        tick() {
            if (this.running) {
                this.secRemaining--;
                if (this.secRemaining <= 0)
                    this.finished = true;
                this.renderReadout();
            }
        }
        onStartPause() {
            this.running = !this.running;
            if (this.running) {
                this.setTimeFromInputs();
                this.renderReadout();
                this.startTicker();
            }
            else {
                this.stopTicker();
            }
            this.renderStartPauseButton();
        }
        setTimeFromInputs() {
            this.secRemaining = this.minInput * 60 + this.secInput;
        }
        renderStartPauseButton() {
            this.$startPauseButton.text(this.running ? 'Pause' : 'Play');
        }
        startTicker() {
            if (this.tickerInterval == null)
                this.tickerInterval = setInterval(this.tick.bind(this), 1e3);
        }
        stopTicker() {
            if (this.tickerInterval != null) {
                clearInterval(this.tickerInterval);
                this.tickerInterval = null;
            }
        }
        onReset() {
            this.setTimeFromInputs();
            this.running = false;
            this.finished = false;
            this.renderReadout();
            this.renderStartPauseButton();
            this.stopTicker();
        }
        renderReadout() {
            this.$timeReadout.text(`${this.secRemaining < 0 ? '-' : ''}${Math.abs(this.min)}:${pad(Math.abs(this.sec))}`);
        }
    }
    function pad(v) {
        return `${Math.abs(v) < 10 ? '0' : ''}${v}`;
    }
    const timerTemplate = $('#timerTemplate');
    const timerSelectors = ['#timerA', '#timerB', '#timerC'];
    const timers = window.timers = timerSelectors.map(selector => {
        $(selector).html(timerTemplate.html());
        return new Timer(selector);
    });
});
