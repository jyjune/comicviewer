// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// | Create
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
let pageInfo = new PageInfo();
let pageHandler = new PageHandler('divPage', pageInfo);
let pageBar = new PageBar('divPageBar', pageInfo);

pageInfo.setOnPageChange(
  ( pFilename, pPageIndex, shouldStartAtFirstPosition, displayPageIndex, displayPageCount ) => {
    pageHandler.loadPage(pFilename, pPageIndex, shouldStartAtFirstPosition);
    let display = document.getElementById('divDisplayPage');
    display.innerHTML = `${displayPageIndex} / ${displayPageCount}`;
    pageBar.draw();
  }
);

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
  if (document.querySelector('#divMenu').classList.contains('active')) {
    closeMenu(e);
  } else {
    openMenu(e);
  }
});

function openMenu(e) {
  let menuButtonStyle = document.querySelector('#divMenuButton').style;
  menuButtonStyle.width = '100%';
  menuButtonStyle.height = '100%';

  document.querySelector('#divMenu').classList.add('active');
  e.stopPropagation();
  let dirLetter = pageInfo.direction == PageDirections.LeftToRight ? '➡️' : '⬅️';
  document.querySelector('#btnChangeDir').innerHTML = `Direction(${dirLetter})`;

  document.querySelectorAll('#divMenu .small_button').forEach((btn) => {
    if (btn.getAttribute('data-inc') == pageInfo.verticalMoveInc) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function closeMenu(e) {
  let menuButtonStyle = document.querySelector('#divMenuButton').style;
  menuButtonStyle.width = '80px';
  menuButtonStyle.height = '80px';

  e.stopPropagation();
  document.querySelector('#divMenu').classList.remove('active');
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// | Load page
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
pageInfo.load('this');

