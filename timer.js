class Timer {
    constructor(element) {
        this.element = element;
        this.timerId = null;
        this.direction = 1;
        this.timer = 0;
        this.warningTime = 0;
        this.isPaused = false;
        this.colorInterval = null;

        this.startButton = this.element.querySelector('.start-button');
        this.resetButton = this.element.querySelector('.reset-button');

        this.hoursDisplay = this.element.querySelector('.hours-display');
        this.minutesDisplay = this.element.querySelector('.minutes-display');
        this.secondsDisplay = this.element.querySelector('.seconds-display');
        
        this.progressBar = this.element.querySelector('.progress-bar');

        this.startButton.addEventListener('click', () => this.startPauseTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());

        this.colorPickers = this.element.querySelectorAll('.cutstomizer-container input[type="color"]');
        this.colorPickers.forEach(picker => picker.addEventListener('change', (e) => this.changeColor(e.target)));

        this.resetButton.disabled = true;
    }

    getTimer() {
        let hours = this.element.querySelector('.time-input .hours').value;
        let minutes = this.element.querySelector('.time-input .minutes').value;
        let seconds = this.element.querySelector('.time-input .seconds').value;
        return (parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60) + parseInt(seconds);
    }

    getWarningTime() {
        let hours = this.element.querySelector('.warn-input .warning-hours').value;
        let minutes = this.element.querySelector('.warn-input .warning-minutes').value;
        let seconds = this.element.querySelector('.warn-input .warning-seconds').value;
        return (parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60) + parseInt(seconds);
    }

    getDirection() {
        return this.element.querySelector('.count-direction').checked ? -1 : 1;
    }

    getWarningColor() {
        return this.element.querySelector('.warning-color').value;
    }

    startPauseTimer() {
        if (this.isPaused || this.timerId === null) {
            this.startTimer();
            this.startButton.textContent = 'Pause';
            this.startButton.style.backgroundColor = 'red';
            this.resetButton.disabled = false;
        } else {
            this.pauseTimer();
            this.startButton.textContent = 'Start';
            this.startButton.style.backgroundColor = 'green';
            this.resetButton.disabled = true;
        }
    }

    pauseTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.isPaused = true;
    }

    startTimer() {
        if (this.timerId !== null) {
            return;
        }

        this.isPaused = false;
        this.timer = this.getTimer();
        this.warningTime = this.getWarningTime();
        this.direction = this.getDirection();

        this.timerId = setInterval(() => {
            this.timer += this.direction;
            let hours = Math.floor(this.timer / 60 / 60);
            let minutes = Math.floor(this.timer / 60) % 60;
            let seconds = this.timer % 60;

   
        

            this.hoursDisplay.textContent = hours < 10 ? '' + hours : hours;
            this.minutesDisplay.textContent = minutes < 10 ? '' + minutes : minutes;
            this.secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;

            this.progressBar.style.width = ((this.timer / (60 * 60 * 24)) * 100) + "%";

            if (this.timer === this.warningTime) {
                this.startBlink();
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.timer = 0;
        this.warningTime = this.getWarningTime();
        this.direction = this.getDirection();

        this.hoursDisplay.textContent = '00';
        this.minutesDisplay.textContent = '00';
        this.secondsDisplay.textContent = '00';
        this.progressBar.style.width = "0%";

        this.startButton.textContent = 'Start';
        this.startButton.style.backgroundColor = 'green';
        this.resetButton.disabled = true;
        
        this.stopBlink();
    }

    startBlink() {
        let toggle = false;
        this.colorInterval = setInterval(() => {
            this.element.querySelector('.timer-container').style.backgroundColor = toggle ? 'red' : '';
            toggle = !toggle;
        }, 2000);
    }

    stopBlink() {
        clearInterval(this.colorInterval);
        this.colorInterval = null;
        this.element.querySelector('.timer box').style.backgroundColor = '';
    }

    changeColor(picker) {
        switch(picker.className) {
            case 'background-color':
                this.element.querySelector('.timer-container').style.backgroundColor = picker.value;
                break;
            case 'text-color':
                this.element.querySelector('.timer-numbers').style.color = picker.value;
                break;
            case 'top-label-color':
                this.element.querySelector('.timer-header').style.color = picker.value;
                break;
            case 'bottom-label-color':
                this.element.querySelector('.timer-footer').style.color = picker.value;
                break;
            default:
                break;
        }
    }
}

document.querySelectorAll('.timer').forEach(timer => new Timer(timer));
