const PageDirections = Object.freeze({
  RightToLeft: Symbol('r2l'),
  LeftToRight: Symbol('l2r')
});

class PageInfo {
  constructor() {
    this.filename = getParameterByName('p_filename');
    this.direction = PageDirections.RightToLeft;
    this.verticalMoveInc = 0;
  }

  setOnPageChange(onChange) {
    this.onPageChange = onChange;
  }

  isRightToLeft() {
    return this.direction == PageDirections.RightToLeft;
  }
  
  load(which) {
    let path = 'reqFile.php?p_filepath=' + this.filename + '&p_which=' + which;
    fetch(path)
      .then(response => response.json()).then(data => {
		console.log(data);
        this.filename = data['filepath'];
        this.pageIndices = data['pageIndex'];
        this.sectionIndices = data['sectionPageIndex'];
        this.direction = data['direction'] == 'RightToLeft' 
          ? PageDirections.RightToLeft
          : PageDirections.LeftToRight;
        this.verticalMoveInc = parseInt(data['verticalMoveInc']);

        console.log('data', data);
        if (which == 'next') {
          this.pageIndex = 0;
        } else if (which == 'this') {
          this.pageIndex = parseInt(data['page']);
        }
        this.needsPageChange(true);
      }).catch(err => console.log(err, path));
  }
  
  needsPageChange(shouldStartAtFirstPosition) {
    this.onPageChange(
      this.filename, this.pageIndices[this.pageIndex], 
      shouldStartAtFirstPosition,
      this.pageIndex+1, this.pageIndices.length);
  }

  goNext() {
    if (this.pageIndex < this.pageIndices.length - 1) {
      this.pageIndex++;
      this.needsPageChange(true);
    } else {
      this.save();
      this.load('next');
    }
  }

  goPrev() {
    if (this.pageIndex <= 0) return;
    this.pageIndex--;
    this.needsPageChange(false);
  }

  goAtProgress(progress, shouldPageGo) {
    if (this.isRightToLeft()) {
      this.pageIndex = Math.floor(this.pageIndices.length * (1 - progress));
    } else {
      this.pageIndex = Math.floor(this.pageIndices.length * progress);
    }
    if (this.pageIndex < 0) this.pageIndex = 0;
    if (this.pageIndex >= this.pageIndices.length) this.pageIndex = this.pageIndices.length - 1;
    
    if (shouldPageGo) this.needsPageChange(true);
  }

  saveAndExit() { 
    this.save(true);
  }

  save(shouldExit) {
    let path = 'reqSave.php?p_filepath=' + this.filename 
    + '&p_page=' + this.pageIndex
    + '&p_page_total=' + this.pageIndices.length
    + '&p_mode=lastpage';
    //console.log(path);

    fetch(path)
      .then(response => response.json()).then(data => {
        if (shouldExit === true) {
          let pos = this.filename.lastIndexOf('/');
          let path = this.filename.substr(0, pos+1);
          window.location.href = 'index.php?p_dir=' + path;
        }
      })
      .catch(err => console.log(err));
  }

  toggleDirection() {
    let direction = '';
    if (this.direction == PageDirections.RightToLeft) {
      this.direction = PageDirections.LeftToRight;
      direction = 'LeftToRight';
    } else {
      this.direction = PageDirections.RightToLeft;
      direction = 'RightToLeft';
    }

    let path = 'reqSave.php?p_filepath=' + this.filename 
    + '&p_dir=' + direction
    + '&p_mode=dir';
    
    this.fetchToSave(path);
  }

  setVerticalMoveInc(inc) {
    let path = 'reqSave.php?p_filepath=' + this.filename 
    + '&p_ver_move_inc=' + inc
    + '&p_mode=verMoveInc';

    this.verticalMoveInc = parseInt(inc);
    
    this.fetchToSave(path);
  }

  fetchToSave(path) {
    fetch(path)
      .then(response => response.json()).then(data => {
        this.needsPageChange(true);
      });
  }

  getXW(width) {
    let x;
    let indicesCount = this.pageIndices.length;
    if (this.isRightToLeft()) {
      x = width - width * (this.pageIndex+1) / indicesCount;
    } else {
      x = width * this.pageIndex / indicesCount;
    }
    let w = width / indicesCount;
    if (w < 8.0) {
      let diffW = w - 8.0;
      x -= diffW/2.0;
      w = 8.0;
    }
    return {x,w};
  }

  getSectionXW(width, handler) {
    let sectionCount = this.sectionIndices.length;
    let indexCount = this.pageIndices.length;
    if (this.isRightToLeft()) {
      for (var i=0; i<sectionCount-1; i++) {
        let x0 = width - width * this.sectionIndices[i] / indexCount;
        let x1 = width - width * this.sectionIndices[i+1] / indexCount;
        handler(x1, x1-x0, i%2 == 0);
      }
    } else {
      for (var i=0; i<sectionCount; i++) {
        let x0 = width * this.sectionIndices[i] / indexCount;
        let x1 = width * this.sectionIndices[i+1] / indexCount;
        handler(x0, x1-x0, i%2 == 0);
      }
    }
  }
}
