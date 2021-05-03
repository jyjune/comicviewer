class UserInput {
  constructor(divId) {
    this.ownerDiv = document.querySelector('#' + divId);
    this.ownerRect = this.ownerDiv.getBoundingClientRect();

    this.inputDownX = 0;
    this.inputDownY = 0;

    this.inputIsDown = false;

    this.dragDeltaX = 0;
    this.dragDeltaY = 0;

    this.isTouchDevice = ('ontouchstart' in document.documentElement);
    if (this.isTouchDevice) {
      this.ownerDiv.addEventListener('touchstart', e => { this.inputDown(e); }, true);
      this.ownerDiv.addEventListener('touchmove', e => { this.inputMove(e); }, {passive: false});
      this.ownerDiv.addEventListener('touchend', e => { this.inputUp(e); }, true);
    } else {
      this.ownerDiv.addEventListener('mousedown', e => { this.inputDown(e); }, true);
      this.ownerDiv.addEventListener('mousemove', e => { this.inputMove(e); }, {passive: false});
      this.ownerDiv.addEventListener('mouseup', e => { this.inputUp(e); }, true);
    }
    document.addEventListener('keydown', e => { this.inputKeyDown(e); }, true);
  }

  inputDown(e) {
    this._inputProcess(e, true);
    this.inputIsDown = true;
  }

  inputMove(e) {
    this._inputProcess(e, false);
  }

  inputUp(e) {
    this._inputProcess(e, false);
    this.inputIsDown = false;
  }

  inputKeyDown(e) {}

  onSizeChange() {
    this.ownerRect = this.ownerDiv.getBoundingClientRect();
  }

  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  // | User Input Utils
  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  _inputProcess(e, isDown) {
    let input = this.isTouchDevice ? (e.touches[0] == undefined ? e.targetTouches[0] : e.touches[0]) : e;
    if (input == undefined) return;
    e.preventDefault();

    let inputX = input.clientX;
    let inputY = input.clientY;
    if (isDown) {
      this.inputDownX = inputX;
      this.inputDownY = inputY;
      this.dragDeltaX = 0;
      this.dragDeltaY = 0;
      this.inputDownTimestamp = new Date().getTime() / 1000.0;
    } else {
      this.dragDeltaX += inputX - this.inputX;
      this.dragDeltaY += inputY - this.inputY;
    }
    this.inputX = inputX;
    this.inputY = inputY;
  }

  isInputClick() {
    return (Math.abs(this.inputX - this.inputDownX) < 5 && Math.abs(this.inputY - this.inputDownY) < 5);
  }

  inputSwipeDirection() {
    let deltaTimestamp = new Date().getTime() / 1000.0 - this.inputDownTimestamp;
    let vx = (this.inputX - this.inputDownX) / deltaTimestamp;
    let vy = (this.inputY - this.inputDownY) / deltaTimestamp;
    let avx = Math.abs(vx);
    let avy = Math.abs(vy);
    if (avx > avy) {
      if (avx > 1000) {
        if (vx > 0) return "RIGHT";
        else return "LEFT";
      } else {
        return "";
      }
    } else {
      if (avy > 1000) {
        if (vy > 0) return "DOWN";
        else return "UP";
      } else {
        return "";
      }
    }
  }
}

/* View in fullscreen */
function openFullscreen() {
  var elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
  }
}

function isFullScreen() {
  var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);
  return isInFullScreen;
}

function toggleFullScreen() {
  var isInFullScreen = isFullScreen();
  if (!isInFullScreen) {
    openFullscreen();
  } else {
    exitFullScreen();
  }
}
class Animator {
  constructor(duration, handleProgress, handleComplete) {
    this.duration = duration * 1000;
    this.handleProgress = handleProgress;
    this.handleComplete = handleComplete;
  }

  start(values0, values1) {
    this.timestamp0 = new Date().getTime();
    this.values0 = values0;
    this.values1 = values1;
    this.deltaValue = new Array(this.values0.length);
    for (let i=0; i<this.values0.length; i++) {
      this.deltaValue[i] = this.values1[i] - this.values0[i];
    }
    this.valuesInProgress = new Array(this.values0.length);
    let that = this;
    setTimeout(() => { that.progress(); }, 1);
  }

  progress() {
    let timestamp = new Date().getTime();
    if (timestamp - this.timestamp0 < this.duration) {
      let progress = (timestamp - this.timestamp0) / this.duration;
      if (this.handleProgress) {
        for (let i=0; i<this.values0.length; i++) {
          this.valuesInProgress[i] = this.deltaValue[i] * progress + this.values0[i];
        }
        this.handleProgress(this.valuesInProgress);
      }
      //console.log(progress);
      let that = this;
      setTimeout(function () { that.progress(); }, 1);
    } else {
      if (this.handleComplete) {
        this.handleComplete(this.values1);
      }
    }
  }
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
