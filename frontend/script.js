async function getsets() {
    const response = await fetch("/sets");
    const sets = await response.json();

    const quizlist = document.getElementById('quizlist');

    for (let set of sets) {
    let div = document.createElement('div');
    div.className = "quizset"; 
    div.innerHTML = `
        <div>
            <div class="settitle">${set.filename}</div>
        </div>
        <div class="startbutton">Start</div>
    `;
    quizlist.appendChild(div);
    div.querySelector('.startbutton').addEventListener('click', () => {
        window.location.href = 'exercise.html';
    });
}
}

getsets();

const input = document.getElementById("input-file");

input.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  await fetch("/upload", {
    method: "POST",
    body: formData
  });
});

