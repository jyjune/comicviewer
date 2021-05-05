class PageHandler extends UserInput {
  constructor(divId, pageInfo) {
    super(divId);

    this.pageInfo = pageInfo;

    this.imgCurrX = 0;
    this.imgCurrY = 0;
    
    this.posId = 0;
    this.posCount = 0;
    this.posArray = new Array();
    this.shouldStartAtInitialPosition = true;

    this.image = this.ownerDiv.querySelector('img');
    this.imageWrapper = this.ownerDiv.querySelector('div');

    this.image.addEventListener('load', ()=>{ this.onImageLoaded(); });
    this.image.addEventListener('error', ()=>{ this.onImageError(); });

    this.animatorMoveBack = new Animator(0.2, 
      values => { // progress
        this.dragDeltaX = values[0];
        this.dragDeltaY = values[1];
        this.updatePosition();
      },
      values => { // complete
        this.dragDeltaX = values[0];
        this.dragDeltaY = values[1];
        this.updatePosition();
      }
    );

    this.animatorPageMove = new Animator(0.2, 
      values => { // progress
        this.imgCurrX = values[0];
        this.imgCurrY = values[1];
        this.dragDeltaX = values[2]; 
        this.dragDeltaY = values[3];
        this.updatePosition();
      },
      values => { // complete
        this.imgCurrX = values[0];
        this.imgCurrY = values[1];
        this.dragDeltaX = values[2];
        this.dragDeltaY = values[3];
        this.updatePosition();
      }
    );
  }
  
  onSizeChange() {
    super.onSizeChange();
    this.resetPageLayout();
  }

  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  // | Image Load Event
  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  onImageError() {
    alert('image load error:'+this.image.src);
  }
  
  onImageLoaded() {
    this.resetPageLayout();
  }
  
  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  // | UI Manipulation
  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  loadPage(pFilename, pPageIndex, shouldStartAtInitialPosition) {
    this.image.src = "image.php?p_file=" + encodeURIComponent(pFilename) + "&p_index=" + pPageIndex;
    this.shouldStartAtInitialPosition = shouldStartAtInitialPosition;
  }

  updatePosition() {
    if (this.ownerRectRatio > 1.0) { // landscape
      this.dragDeltaX = 0;
    } else {
      this.dragDeltaY = 0;
    }
    this.imageWrapper.style.left = (this.imgCurrX + this.dragDeltaX) + 'px';
    this.imageWrapper.style.top = (this.imgCurrY + this.dragDeltaY) + 'px';
  }

  resetPageLayout() {
    //console.log(`Page width:${this.image.naturalWidth}, height:${this.image.naturalHeight}, ratio: ${this.image.naturalWidth / this.image.naturalHeight}`);
    this.ownerRectRatio = this.ownerRect.width / this.ownerRect.height;
    if (this.ownerRectRatio > 1.0) this.resetPageLayoutLandscape();
    else this.resetPageLayoutPortrait();
  }

  resetPageLayoutPortrait() {
    let naturalImageRatio = this.image.naturalWidth / this.image.naturalHeight;
    
    let imgY0 = 0;
    let imgWidth = 0;
    let imgHeight = 0;
    if (this.ownerRectRatio * 2 < naturalImageRatio) {
      // if protrait height is too long
      imgWidth = this.ownerRect.width * 2;
      imgHeight = this.image.naturalHeight / this.image.naturalWidth * (this.ownerRect.width*2);
      imgY0 = (this.ownerRect.height - imgHeight)/2;
    } else {
      if (naturalImageRatio > this.ownerRectRatio && naturalImageRatio < 0.8)
        {
          imgWidth = this.ownerRect.width;
          imgHeight = this.image.naturalHeight / this.image.naturalWidth * this.ownerRect.width;
          imgY0 = (this.ownerRect.height - imgHeight)/2;
        } else {
          imgWidth = this.image.naturalWidth / this.image.naturalHeight * this.ownerRect.height;
          imgHeight = this.ownerRect.height;
          imgY0 = 0;
        }
    }

    this.posArray = Array();
    
    if (this.ownerRect.width >= imgWidth) { // screen emcompass page
      this.posArray.push({x:(this.ownerRect.width - imgWidth)/2, y:imgY0});
      this.posCount = 1;
    } else {
      this.posCount = 2;
      if (this.pageInfo.isRightToLeft()) { // i.e. Japanese
        this.posArray.push({x:this.ownerRect.width - imgWidth, y:imgY0});
        this.posArray.push({x:0, y:imgY0});
      } else { // i.e. Korean
        this.posArray.push({x:0, y:0});
        this.posArray.push({x:this.ownerRect.width - imgWidth, y:imgY0});
      }
    }

    this.resetPageLayoutApply(imgWidth, imgHeight);
  }

  resetPageLayoutLandscape() {
    let naturalImageRatio = this.image.naturalWidth / this.image.naturalHeight;

    let imgX0, imgX1, imgY0;
    let imgWidth = 0;
    let imgHeight = 0;

    this.posArray = Array();

    if (naturalImageRatio < 1.0) { // single page
      imgWidth = this.ownerRect.width;
      imgHeight = this.image.naturalHeight / this.image.naturalWidth * this.ownerRect.width;
      imgX0 = (this.ownerRect.width - imgWidth)/2;

      if (pageInfo.verticalMoveInc == -1) {
        this.posCount = 1;
        if (naturalImageRatio > this.ownerRectRatio) {
          imgWidth = this.ownerRect.width;
          imgHeight = this.image.naturalHeight / this.image.naturalWidth * this.ownerRect.width;
          imgY0 = (this.ownerRect.height - imgHeight)/2;
          this.posArray.push({x:0, y:imgY0});
        } else {
          imgWidth = this.image.naturalWidth / this.image.naturalHeight * this.ownerRect.height;
          imgHeight = this.ownerRect.height;
          imgX0 = (this.ownerRect.width - imgWidth)/2;
          this.posArray.push({x:imgX0, y:0});
        }
      } else {
        this.posCount = Math.ceil(imgHeight / this.ownerRect.height) + pageInfo.verticalMoveInc;
        let deltaY = (imgHeight-this.ownerRect.height) / (this.posCount - 1);
        for (let i=0; i<this.posCount; i++) {
          this.posArray.push({x:imgX0, y:-i*deltaY});
        }
      }
    } else { // two pages in one image
      if (pageInfo.verticalMoveInc == -1) {
        this.posCount = 1;
        if (naturalImageRatio > this.ownerRectRatio) {
          imgWidth = this.ownerRect.width;
          imgHeight = this.image.naturalHeight / this.image.naturalWidth * this.ownerRect.width;
          imgY0 = (this.ownerRect.height - imgHeight)/2;
          this.posArray.push({x:0, y:imgY0});
        } else {
          imgWidth = this.image.naturalWidth / this.image.naturalHeight * this.ownerRect.height;
          imgHeight = this.ownerRect.height;
          imgX0 = (this.ownerRect.width - imgWidth)/2;
          this.posArray.push({x:imgX0, y:0});
        }
      } else {
        imgWidth = this.ownerRect.width * 2;
        imgHeight = this.image.naturalHeight / this.image.naturalWidth * (this.ownerRect.width*2);

        let rowCount = Math.ceil(imgHeight / this.ownerRect.height) + pageInfo.verticalMoveInc;
        this.posCount = rowCount * 2;
        let deltaY = (imgHeight-this.ownerRect.height) / (rowCount - 1);
  
        if (this.pageInfo.isRightToLeft()) { // i.e. Japanese
          imgX0 = this.ownerRect.width*(-1);
          imgX1 = 0;
        } else {
          imgX0 = 0;
          imgX1 = this.ownerRect.width*(-1);
        }
        for (let i=0; i<rowCount; i++) {
          this.posArray.push({x:imgX0, y:-i*deltaY});
        }
        for (let i=rowCount; i<this.posCount; i++) {
          this.posArray.push({x:imgX1, y:-(i-rowCount)*deltaY});
        }
      }
    }
    this.resetPageLayoutApply(imgWidth, imgHeight);
  }

  resetPageLayoutApply(imgWidth, imgHeight) {
    this.posId = (this.shouldStartAtInitialPosition) ? 0 : this.posCount-1;

    this.image.width = imgWidth;
    this.image.height = imgHeight;

    let pos = this.posArray[this.posId];
    this.imgCurrX = pos.x;
    this.imgCurrY = pos.y;

    this.imageWrapper.style.left = pos.x + 'px';
    this.imageWrapper.style.top = pos.y + 'px';
    this.imageWrapper.style.width = imgWidth + 'px';
    this.imageWrapper.style.height = imgHeight + 'px';
  }
  
  goPage(dir) {
    if (dir)  { if (this.pageInfo.isRightToLeft()) this.goNextPage(); else this.goPrevPage(); }
    else      { if (this.pageInfo.isRightToLeft()) this.goPrevPage(); else this.goNextPage(); }
  }

  goPrevPage() {
    let posId = this.posId - 1;
    if (posId > -1) {
      let pos = this.posArray[posId];
      this.animatorPageMove.start([this.imgCurrX, this.imgCurrY, this.dragDeltaX, this.dragDeltaY], [pos.x, pos.y, 0, 0]);
      this.posId = posId;
    } else {
      this.pageInfo.goPrev();
    }
  }

  goNextPage() {
    let posId = this.posId + 1;
    if (posId < this.posCount) {
      let pos = this.posArray[posId];
      this.animatorPageMove.start([this.imgCurrX, this.imgCurrY, this.dragDeltaX, this.dragDeltaY], [pos.x, pos.y, 0, 0]);
      this.posId = posId;
    } else {
      this.pageInfo.goNext();
    }
  }

  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  // | User Input
  // +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  inputDown(e) {
    super.inputDown(e);
    this.inputIsDown = true;
  }

  inputMove(e) {
    super.inputMove(e);
    if (this.inputIsDown) {
      this.updatePosition();
    }
  }

  inputUp(e) {
    super.inputUp(e);
    if (this.isInputClick()) {
      this.goPage(this.pageInfo.isRightToLeft());
    } else {
      let swipe = this.inputSwipeDirection()
      console.log(swipe);
      if (swipe != '') {
        if (swipe == 'LEFT' || swipe == 'RIGHT') {
          this.goPage(swipe == 'RIGHT');
        } else {
          if (swipe == 'UP') {
            this.goNextPage();
          } else { // DOWN
            this.goPrevPage();
          }
        }
      } else {
        //this.animatorMoveBack.start([self.dragDeltaX, self.dragDeltaY], [0, 0]);
        let pos = this.posArray[this.posId];
        this.animatorPageMove.start([this.imgCurrX, this.imgCurrY, this.dragDeltaX, this.dragDeltaY], [pos.x, pos.y, 0, 0]);
      }
    }
  }

  inputKeyDown(e) {
    // Left 37  / Up 38 / Right 39 / Down 40
    //alert(e.keyCode);
    if (e.keyCode == 32) { // Space
      this.goNextPage();
      e.preventDefault(); 
    } else if (e.keyCode == 37) { // Left
      this.goPage(true);
    } else if (e.keyCode == 39) { // Right
      this.goPage(false);
    } else if (e.keyCode == 70) { // 'f'
      openFullscreen();
      this.pageInfo.show(true);
    }
  }  
}
