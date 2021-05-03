// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// | Create
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
let pageInfo = new PageInfo();
pageInfo.setOnPageChange(
  ( pFilename, pPageIndex, shouldStartAtFirstPosition, displayPageIndex, displayPageCount ) => {
    pageHandler.loadPage(pFilename, pPageIndex, shouldStartAtFirstPosition);
    let display = document.getElementById('divDisplayPage');
    display.innerHTML = `${displayPageIndex} / ${displayPageCount}`;
    pageBar.draw();
  }
);

let pageHandler = new PageHandler('divPage', pageInfo);
let pageBar = new PageBar('divPageBar', pageInfo);

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// | Assign Event Listener
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
document.addEventListener('fullscreenchange', ()=>{
  if (document.fullscreenElement) {
    console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    console.log(document.fullscreenElement);
  } else {
    console.log('Leaving full-screen mode.');
  }
  pageBar.onSizeChange();
  pageHandler.onSizeChange();
});

window.addEventListener("beforeunload", ()=>{pageInfo.save();});
window.addEventListener("dragstart", ()=>{ return false; } );
window.addEventListener("resize", ()=>{ 
  pageBar.onSizeChange();
  pageHandler.onSizeChange();
}, false);

document.querySelector('#btnFullscreen').addEventListener('click', e=>{
  closeMenu(e);
  toggleFullScreen();
  pageInfo.needsPageChange(true);
});

document.querySelector('#btnEnableNav').addEventListener('click', e=>{
  closeMenu(e);
  pageBar.toggleActive();
});

document.querySelector('#btnChangeDir').addEventListener('click', e=>{
  closeMenu(e);
  pageInfo.toggleDirection();
});

document.querySelectorAll('#divMenu .small_button').forEach((btn, index) => {
  btn.addEventListener('click', e=>{
    document.querySelectorAll('#divMenu .small_button').forEach(btn => btn.classList.remove('selected'));
    btn.classList.add('selected');
    pageInfo.setVerticalMoveInc(btn.getAttribute('data-inc'));
    closeMenu(e);
  });
});

document.querySelector('#btnExit').addEventListener('click', e=>{
  closeMenu(e);
  exitFullScreen();
  pageInfo.saveAndExit();
});

document.querySelector('#divMenuButton').addEventListener('click', e=>{
  openMenu(e);
});

function openMenu(e) {
  document.querySelector('#divMenu').classList.toggle('active');
  e.stopPropagation();
  let dirLetter = pageInfo.direction == PageDirections.LeftToRight ? '➡️' : '⬅️';
  document.querySelector('#btnChangeDir').innerHTML = `Direction(${dirLetter})`;

  document.querySelectorAll('#divMenu .small_button').forEach((btn, index) => {
    if (index == pageInfo.verticalMoveInc) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function closeMenu(e) {
  e.stopPropagation();
  document.querySelector('#divMenu').classList.remove('active');
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// | Load page
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
pageInfo.load('this');

