$(() => {
    class Timer {
        $wrap: JQuery;
        $root: JQuery;
        $minInput: JQuery;
        $secInput: JQuery;
        $timeReadout: JQuery;
        $startPauseButton: JQuery;
        $resetButton: JQuery;
        tickerInterval: number | null = null;
        constructor(selector: string) {
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
        set minInput(v: number) {
            this.$minInput.val(v);
        }
        get secInput() {
            const a = +this.$secInput.val();
            return Number.isNaN(a) ? 0 : a;
        }
        set secInput(v: number) {
            this.$secInput.val(v);
        }

        running: boolean;
        secRemaining: number = 0;
        get min() {
            const a = this.secRemaining / 60;
            return a > 0 ? Math.floor(a) : Math.ceil(a);
        }
        get sec() {
            return this.secRemaining % 60;
        }
        _finished = false;
        get finished() {
            return this._finished;
        }
        set finished(v: boolean) {
            this._finished = v;
            const className = 'finished';
            if (v) this.$root.addClass(className);
            else this.$root.removeClass(className);
        }
        tick() {
            if (this.running) {
                this.secRemaining--;
                if (this.secRemaining <= 0) this.finished = true;
                this.renderReadout();
            }
        }
        onStartPause() {
            this.running = !this.running;
            if (this.running) {
                this.setTimeFromInputs();
                this.renderReadout();
                this.startTicker();
            } else {
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
            if (this.tickerInterval == null) this.tickerInterval = setInterval(this.tick.bind(this), 1e3);
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
    function pad(v: number) {
        return `${Math.abs(v) < 10 ? '0' : ''}${v}`;
    }

    const timerTemplate = $('#timerTemplate');
    const timerTemplates = [{
        selector: '#timerA', min: 1, sec: 0
    }, {
        selector: '#timerB', min: 0, sec: 45
    }, {
        selector: '#timerC', min: 0, sec: 30
    }, {
        selector: '#timerD', min: 0, sec: 15
    }];
    const timers = (window as any).timers = timerTemplates.map(({ selector, min, sec }) => {
        $(selector).html(timerTemplate.html());
        const timer = new Timer(selector);
        timer.minInput = min;
        timer.secInput = sec;
    });
});