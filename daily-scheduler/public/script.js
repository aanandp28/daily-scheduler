const startHour = 6;
const endHour = 22;

window.onload = () => {
  const container = document.getElementById('schedule-container');
  for (let hour = startHour; hour <= endHour; hour++) {
    const row = document.createElement('div');
    row.className = 'schedule-row';

    const label = document.createElement('label');
    label.innerText = formatHour(hour);

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.id = `task-${hour}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `check-${hour}`;
    checkbox.onchange = updateProgress;

    row.appendChild(label);
    row.appendChild(taskInput);
    row.appendChild(checkbox);

    container.appendChild(row);
  }

  updateProgress();
};

function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${suffix}`;
}

function updateProgress() {
  let total = 0;
  let done = 0;
  for (let hour = startHour; hour <= endHour; hour++) {
    total++;
    if (document.getElementById(`check-${hour}`).checked) {
      done++;
    }
  }
  document.getElementById('progress-text').innerText = `Tasks Completed: ${done}/${total}`;
}

// ✅ Save schedule to backend
function saveSchedule() {
  const data = {
    priorities: [],
    schedule: {}
  };

  // Collect priorities
  const inputs = document.querySelectorAll('.priorities input');
  inputs.forEach((input, index) => {
    data.priorities[index] = input.value;
  });

  // Collect schedule data
  for (let hour = startHour; hour <= endHour; hour++) {
    const task = document.getElementById(`task-${hour}`).value;
    const done = document.getElementById(`check-${hour}`).checked;
    data.schedule[hour] = { task, done };
  }

  // Send to backend
  fetch('/save-schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.text())
    .then(msg => alert(msg))
    .catch(err => {
      console.error(err);
      alert("Save failed!");
    });
}

// ✅ Load schedule from backend
function loadSchedule() {
  fetch('/load-schedule')
    .then(res => res.json())
    .then(data => {
      // Load priorities
      const inputs = document.querySelectorAll('.priorities input');
      inputs.forEach((input, index) => {
        input.value = data.priorities?.[index] || '';
      });

      // Load schedule data
      for (let hour = startHour; hour <= endHour; hour++) {
        const taskField = document.getElementById(`task-${hour}`);
        const checkbox = document.getElementById(`check-${hour}`);
        const item = data.schedule?.[hour];

        taskField.value = item?.task || '';
        checkbox.checked = item?.done || false;
      }

      updateProgress();
    })
    .catch(err => {
      console.error(err);
      alert("Load failed!");
    });
}

// 🔄 Clear inputs on page
function clearSchedule() {
  const inputs = document.querySelectorAll('.priorities input');
  inputs.forEach(input => input.value = '');

  for (let hour = startHour; hour <= endHour; hour++) {
    document.getElementById(`task-${hour}`).value = '';
    document.getElementById(`check-${hour}`).checked = false;
  }

  updateProgress();
}
