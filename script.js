const { ipcRenderer } = require('electron');

// Global variables
let tasks = [];
let taskIdCounter = 0;

// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const minimizeBtn = document.getElementById('minimize-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeBtn = document.getElementById('close-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings');
const transparencySlider = document.getElementById('transparency-slider');
const transparencyValue = document.getElementById('transparency-value');
const colorPicker = document.getElementById('color-picker');
const textColorPicker = document.getElementById('text-color-picker');
const app = document.getElementById('app');

// Initialize app
function init() {
  loadTasks();
  loadSettings();
  updateTaskCount();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  // Task management
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);
  
  // Window controls
  minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-to-side');
  });
  
  settingsBtn.addEventListener('click', toggleSettings);
  closeSettingsBtn.addEventListener('click', toggleSettings);
  
  closeBtn.addEventListener('click', () => {
    window.close();
  });
  
  // Settings
  transparencySlider.addEventListener('input', updateTransparency);
  colorPicker.addEventListener('change', updateBackgroundColor);
  textColorPicker.addEventListener('change', updateTextColor);
}

// Task management functions
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;
  
  const task = {
    id: taskIdCounter++,
    text: taskText,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  taskInput.value = '';
  renderTasks();
  saveTasks();
  updateTaskCount();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
    saveTasks();
    updateTaskCount();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  saveTasks();
  updateTaskCount();
}

function clearCompletedTasks() {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
  saveTasks();
  updateTaskCount();
}

function renderTasks() {
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    taskItem.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
             onchange="toggleTask(${task.id})">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})">✕</button>
    `;
    
    taskList.appendChild(taskItem);
  });
}

function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;
  
  taskCount.textContent = `${remaining} remaining, ${total} total`;
}

// Settings functions
function toggleSettings() {
  settingsPanel.classList.toggle('hidden');
}

function updateTransparency() {
  const opacity = parseFloat(transparencySlider.value);
  const percentage = Math.round(opacity * 100);
  transparencyValue.textContent = `${percentage}%`;
  
  ipcRenderer.send('set-transparency', opacity);
  saveSettings();
}

function updateBackgroundColor() {
  const color = colorPicker.value;
  const rgb = hexToRgb(color);
  const currentOpacity = getCurrentOpacity();
  
  app.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
  saveSettings();
}

function updateTextColor() {
  const color = textColorPicker.value;
  document.body.style.color = color;
  
  // Update all text elements
  document.querySelectorAll('.task-text, .title, #task-count').forEach(el => {
    el.style.color = color;
  });
  
  saveSettings();
}

function getCurrentOpacity() {
  const currentBg = window.getComputedStyle(app).backgroundColor;
  const match = currentBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  return match && match[4] ? parseFloat(match[4]) : 0.8;
}

// Storage functions
function saveTasks() {
  localStorage.setItem('checklist-tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('checklist-tasks');
  if (stored) {
    tasks = JSON.parse(stored);
    taskIdCounter = Math.max(...tasks.map(t => t.id), 0) + 1;
    renderTasks();
  }
}

function saveSettings() {
  const settings = {
    transparency: transparencySlider.value,
    backgroundColor: colorPicker.value,
    textColor: textColorPicker.value
  };
  localStorage.setItem('checklist-settings', JSON.stringify(settings));
}

function loadSettings() {
  const stored = localStorage.getItem('checklist-settings');
  if (stored) {
    const settings = JSON.parse(stored);
    
    transparencySlider.value = settings.transparency || '0.8';
    colorPicker.value = settings.backgroundColor || '#2c3e50';
    textColorPicker.value = settings.textColor || '#ecf0f1';
    
    updateTransparency();
    updateBackgroundColor();
    updateTextColor();
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Make functions globally available
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);