(function () {
  'use strict';

  var sectors = ['50 FS', '100%', '20 FS', '200%', '10 FS', '100% + 50 FS', '75%', '30 FS'];
  var colors  = ['#ff3d7f', '#3d5afe', '#00c853', '#ff9100', '#aa00ff', '#ffcc33', '#00b8d4', '#e53935'];
  var WIN_INDEX = 5;

  var canvas = document.getElementById('wheel');
  var ctx = canvas.getContext('2d');
  var spinBtn = document.getElementById('spin');
  var attemptsEl = document.getElementById('attempts');
  var modal = document.getElementById('modal');

  var attempts = 2;
  var rotation = 0;
  var spinning = false;
  var n = sectors.length;
  var arc = 360 / n;

  function draw() {
    var size = canvas.width, r = size / 2;
    ctx.clearRect(0, 0, size, size);
    for (var i = 0; i < n; i++) {
      var start = (i * arc - 90) * Math.PI / 180;
      var end = ((i + 1) * arc - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 2, start, end);
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.strokeStyle = '#ffffff55';
      ctx.stroke();

      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(start + (end - start) / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(sectors[i], r - 14, 5);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(r, r, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1438';
    ctx.fill();
  }

  function angleFor(idx) {
    return 360 - (idx * arc + arc / 2);
  }

  function spin() {
    if (spinning || attempts <= 0) return;
    spinning = true;
    spinBtn.disabled = true;
    attempts--;
    attemptsEl.textContent = attempts;

    var target = attempts === 0 ? WIN_INDEX : 2;
    var base = rotation - (rotation % 360);
    rotation = base + 360 * 6 + angleFor(target);
    canvas.style.transform = 'rotate(' + rotation + 'deg)';

    setTimeout(function () {
      spinning = false;
      if (attempts === 0) {
        modal.hidden = false;
      } else {
        spinBtn.disabled = false;
        spinBtn.textContent = 'Ещё раз';
      }
    }, 4700);
  }

  draw();
  spinBtn.addEventListener('click', spin);
})();
