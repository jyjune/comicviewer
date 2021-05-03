const PageBarHeight = 20;
const PageBarHeightNormal = 10;

class PageBar extends UserInput {
  constructor(divId, pageInfo) {
    super(divId);
    this.pageInfo = pageInfo;

    this.canvas = document.createElement('canvas');
    this.ownerDiv.appendChild(this.canvas);

    this.isActive = false;

    this.canvas.width = this.ownerRect.width;
    this.canvas.height = PageBarHeight;
    this.canvas.style.marginTop = `${this.ownerRect.height - PageBarHeight}px`;
  }

  onSizeChange() {
    super.onSizeChange();
    this.canvas.width = this.ownerRect.width;
    this.canvas.height = PageBarHeight;
    this.canvas.style.marginTop = `${this.ownerRect.height - PageBarHeight}px`;
    this.draw();
  }

  // Active
  setActive(isActive) {
    this.isActive = isActive;
  }
  
  toggleActive() {
    this.isActive = this.isActive ? false : true;
    this.draw();
  }

  inputDown(e) {
    super.inputDown(e);
    e.stopPropagation();
    if (!this.isActive) return;
    // this.isDown = true;
    this._processInput(false);
  }
  inputMove(e) {
    super.inputMove(e);
    e.stopPropagation();
    if (!this.isActive || !this.inputIsDown) return;
    this._processInput(false);
  }
  inputUp(e) {
    super.inputUp(e);
    e.stopPropagation();
    if (!this.isActive) return;
    this._processInput(true);
  }

  _processInput(shouldPageGo) {
    if (this.inputY < 0) return;
    this.pageInfo.goAtProgress(this.inputX / this.ownerRect.width, shouldPageGo);
    this.draw();
  }

  // Draw
  draw() {
    let navHeight = this.isDown ?  PageBarHeight : PageBarHeightNormal;
    let navY = this.canvas.height - navHeight;

    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw current position
    const {x,w} = this.pageInfo.getXW(this.canvas.width);  
    ctx.beginPath();
    ctx.fillStyle = this.isDown || this.isActive ? "#ff0000ff" : "#ff000050";
    ctx.fillRect(x, navY, w, navHeight);

    // Draw Sections
    ctx.strokeStyle = this.isDown || this.isActive ? "#000000" :  "#00000040";
    ctx.fillStyle = this.isDown || this.isActive ? "#aaffaa90" : "#aaffaa50";
    this.pageInfo.getSectionXW(this.canvas.width, (x,w,onOff) => {
      ctx.moveTo(x, navY);
      ctx.lineTo(x, navY+navHeight);
      if (onOff) {
        ctx.fillRect(x, navY, w, navHeight);
      }
    });

    // Draw Box
    ctx.strokeRect(0.5, navY, this.canvas.width-1, navHeight-1.5);

    ctx.closePath()
    ctx.stroke();
  }
}
