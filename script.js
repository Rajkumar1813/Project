const clockElement = document.querySelector('.clock');
const reminderListElement = document.getElementById('reminderList');
let alarmTimeout; // To store the alarm timeout reference

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  clockElement.textContent = timeString;

  checkReminders(timeString);

  setTimeout(updateClock, 1000);
}

function addReminder() {
  const medicineInput = document.getElementById('medicineInput');
  const timeInput = document.getElementById('timeInput');
  const medicineName = medicineInput.value;
  const reminderTime = timeInput.value;

  if (medicineName && reminderTime) {
    const reminder = {
      name: medicineName,
      time: reminderTime
    };
    createReminderElement(reminder);
    medicineInput.value = '';
    timeInput.value = '';
  }
}

function createReminderElement(reminder) {
  const li = document.createElement('li');
  li.innerHTML = `
    <input type="checkbox">
    <span><b>${reminder.name}</b> at <b>${reminder.time}</b></span>
    <button onclick="editReminder(this)"><i class="bi bi-pencil-square"></i></button>
    <button onclick="deleteReminder(this)"><i class="bi bi-trash"></i></button>
  `;
  reminderListElement.appendChild(li);
}

function checkReminders(currentTime) {
  const reminders = document.querySelectorAll('#reminderList li');
  reminders.forEach((reminder) => {
    const timeString = reminder.querySelector('span').textContent.split(' at ')[1];
    if (timeString === currentTime) {
      // Ring alarm
      ringAlarm(reminder.querySelector('span').textContent.split(' at ')[0]);
      // Remove reminder
      reminder.remove();
    } else if (getSecondsDiff(currentTime, timeString) === 30) {
      // Ring 30 seconds before the reminder time
      ringAlarm(reminder.querySelector('span').textContent.split(' at ')[0]);
    }
  });
}

function ringAlarm(medicineName) {
  // You can implement the alarm sound or notification here
  const audio = new Audio('alarm.mp3'); // Replace 'alarm_sound.mp3' with your alarm sound file path
  audio.loop = true;
  audio.play();
  alarmTimeout = setTimeout(() => {
    audio.pause();
    alert(`Time to take ${medicineName}! Click OK after taking the medicine.`);
  }, 30000); // Ring for 30 seconds (30000 milliseconds)
}

function getSecondsDiff(time1, time2) {
  const date1 = new Date(`2000-01-01T${time1}`);
  const date2 = new Date(`2000-01-01T${time2}`);
  return (date2 - date1) / 1000;
}

function editReminder(editButton) {
  const li = editButton.parentNode;
  const reminder = li.querySelector('span').textContent.split(' at ');
  const medicineInput = document.getElementById('medicineInput');
  const timeInput = document.getElementById('timeInput');
  medicineInput.value = reminder[0];
  timeInput.value = reminder[1];
  li.remove();
}

function deleteReminder(deleteButton) {
  const li = deleteButton.parentNode;
  li.remove();
}

// Stop the alarm when the user clicks OK in the alert box
document.addEventListener('click', () => {
  clearTimeout(alarmTimeout);
});

updateClock();
