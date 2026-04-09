const inputs = document.querySelectorAll("input");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = 220;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  calc();
});

function format(num) {
  return "₹ " + Math.round(num).toLocaleString("en-IN");
}

function calc() {
  let m = +document.getElementById("monthly").value;
  let r = +document.getElementById("rate").value / 12 / 100;
  let y = +document.getElementById("years").value * 12;
  let s = +document.getElementById("stepup").value / 100;

  if (!m || !r || !y) return;

  let invested = 0;
  let val = 0;

  let investedArr = [];
  let valueArr = [];

  for (let i = 1; i <= y; i++) {
    let inc = Math.pow(1 + s, Math.floor(i / 12));
    let amt = m * inc;

    invested += amt;
    val = (val + amt) * (1 + r);

    investedArr.push(invested);
    valueArr.push(val);
  }

  document.getElementById("invested").innerText = format(invested);
  document.getElementById("returns").innerText = format(val - invested);
  document.getElementById("value").innerText = format(val);

  drawChart(investedArr, valueArr);
}

function drawChart(invested, value) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let max = Math.max(...value);
  let padding = 30;

  function drawLine(data, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((val, i) => {
      let x = (i / data.length) * (canvas.width - padding * 2) + padding;
      let y = canvas.height - (val / max) * (canvas.height - padding * 2) - padding;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  // Invested line (gray)
  drawLine(invested, "#94a3b8");

  // Value line (green)
  drawLine(value, "#22c55e");

  // Fill under value curve
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.closePath();

  ctx.fillStyle = "rgba(34,197,94,0.15)";
  ctx.fill();
}

// Download results
document.getElementById("download").addEventListener("click", () => {
  const text = `
SIP Calculation Results

Invested: ${document.getElementById("invested").innerText}
Returns: ${document.getElementById("returns").innerText}
Total Value: ${document.getElementById("value").innerText}
`;

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sip-results.txt";
  link.click();
});

inputs.forEach(i => i.addEventListener("input", calc));

calc();