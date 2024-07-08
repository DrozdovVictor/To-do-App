/* Header */

const taskListHeaderContent = document.getElementById(
  "task-list-header-content"
);
const taskListTime = [
  document.getElementById("task-list-time-main"),
  document.getElementById("task-list-time-add"),
  document.getElementById("task-list-time-edit"),
];
const tastListDate = document.getElementById("current-date");

/* Main */

const taskListSlider = document.getElementById("task-list-slider");
const taskListSliderWrapper = document.getElementById(
  "task-list-slider-wrapper"
);
const allTasksList = document.getElementById("all-tasks");
const taskListGradientTop = document.getElementById("task-list-gradient-top");

const taskAddBtn = document.getElementById("task-add-btn");

const completedTasks = document.getElementById("completed-tasks");

/* Footer */

const allTasksBtn = document.getElementById("all-tasks-btn");
const completedTasksBtn = document.getElementById("completed-tasks-btn");

/* Add Task */

const addTaskPage = document.getElementById("add-task-page");
const addTaskBtnBack = document.getElementById("add-task-btn-back");
const taskBtnAdd = document.getElementById("task-btn-add");

const taskTitle = document.getElementById("add-task-title");
const taskDescription = document.getElementById("add-task-description");

const addTaskWarning = document.getElementById("add-task-warning");

/* Edit Task */

const editTaskTitle = document.getElementById("edit-task-title");
const editTaskDescription = document.getElementById("edit-task-description");

/* Logic */

/* Set Current Time */

setInterval(function () {
  let now = `${new Date().getHours()}:0${new Date().getMinutes()}`;
  if (new Date().getMinutes() > 9) {
    now = `${new Date().getHours()}:${new Date().getMinutes()}`;
  }

  taskListTime.forEach((el) => (el.textContent = `${now}`));
}, 1000);

function setCurrentDay() {
  if (new Date().getDate() < 8 || new Date().getMonth() < 8) {
    tastListDate.innerHTML = `0${new Date().getDate()}/0${
      new Date().getMonth() + 1
    }  <span class="task-list__date-line"></span>`;
  } else {
    tastListDate.innerHTML = `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }  <span class="task-list__date-line"></span>`;
  }
}

setCurrentDay();

/* Show first example task during load */

/* For All Task */

function createExampleAllTask() {
  const textToHide = document.querySelector(".task-list__empty-all-tasks-text");
  if (textToHide !== null) {
    textToHide.remove();
  }

  if (allTasksList.children.length >= 1) return;
  allTasksList.append(getTaskTemplate());
  indexAllTasks();
  safeAllTasks();
}

/* For Completed Task */

function createExampleCompletedTask() {
  const textToHide = document.querySelector(
    ".task-list__empty-completed-tasks-text"
  );

  if (textToHide !== null) {
    textToHide.remove();
  }

  if (completedTasks.children.length >= 1) return;
  completedTasks.append(makeCompletedTaskFromTemlate(getTaskTemplate()));
  safeCompletedTasks();
}

window.addEventListener("load", function start() {
  createExampleAllTask();
  createExampleCompletedTask();
});

/* Main */

taskAddBtn.addEventListener("click", function () {
  addTaskPage.style.display = "flex";
  addTaskPage.style.animation = "show .3s";
});

allTasksList.addEventListener("scroll", function () {
  if (!allTasksList.scrollTop <= 15) {
    taskListGradientTop.style.display = "block";
  }

  if (allTasksList.scrollTop < 15) {
    taskListGradientTop.style.display = "none";
  }
});

/* Make Tasks Nav Btns Interactive */

function removeTaskWithAnimation(el) {
  el.style.animation = "easyHide2 .5s";
  setTimeout(function () {
    el.remove();
  }, 350);
}

taskListSliderWrapper.addEventListener("click", function (event) {
  let targetEL = event.target;
  let targetELData = event.target.dataset.action;
  let targetTask = targetEL.closest(".task-list__item");
  switch (targetELData) {
    case "trash":
      targetTask.remove(), // delete task
        showAllTaskText();
      showCompletedTaskText();
      indexAllTasks();
      break;
    case "edit":
      clearAllDataActiveAttrs(),
        targetTask.setAttribute("data-active", "active"),
        startEditTask(),
        getCurrentTaskValues();
      break;
    case "done":
      completedTasks.append(makeCompletedTaskFromTemlate(targetTask)),
        showAllTaskText(),
        showCompletedTaskText(),
        hideCompletedTaskText(),
        safeCompletedTasks(),
        indexAllTasks();
      break;
    case "undone":
      targetTask.remove(), makeUncompletedTaskFromTemplate(targetTask);
      indexAfterUndoneBtn(targetTask, targetTask.dataset.index);
      safeCompletedTasks(),
        showCompletedTaskText(),
        hideAllTaskText(),
        safeAllTasks();
      break;
  }

  safeAllTasks();
  safeCompletedTasks();
});

/* Themes */
{
  const themes = Array.from(document.getElementById("themes").children);

  function setTheme(main, mainBg, itemMain) {
    document.documentElement.style.setProperty("--main", `${main}`);
    document.documentElement.style.setProperty("--main-bg", `${mainBg}`);
    document.documentElement.style.setProperty("--item-main", `${itemMain}`);
    document.documentElement.style.setProperty(
      "--gradient-top",
      `linear-gradient(180deg, ${mainBg}, 0%, transparent)`
    );
    document.documentElement.style.setProperty(
      "--gradient-bottom",
      `linear-gradient(transparent, 40%, ${mainBg})`
    );

    let theme = {
      main: main,
      mainBg: mainBg,
      itemMain: itemMain,
    };

    return theme;
  }

  themes.forEach((el) => {
    el.addEventListener("click", () => {
      if (el.classList.contains("blue")) {
        setTheme("#0096C7", "#90E0EF", "#48CAE4");
        safeTheme("#0096C7", "#90E0EF", "#48CAE4");
      } else if (el.classList.contains("purple")) {
        setTheme("#9395D3", "#D6D7EF", "#B3B7EE");
        safeTheme("#9395D3", "#D6D7EF", "#B3B7EE");
      } else if (el.classList.contains("green")) {
        setTheme("#4C9A2A", "#A4DE02", "#76BA1B");
        safeTheme("#4C9A2A", "#A4DE02", "#76BA1B");
      }
    });
  });

  function safeTheme(main, mainBg, itemMain) {
    localStorage.setItem(
      "currentTheme",
      JSON.stringify(setTheme(main, mainBg, itemMain))
    );
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("currentTheme") === null) {
      safeTheme("#9395D3", "#D6D7EF", "#B3B7EE");
    } else {
      let currentTheme = JSON.parse(localStorage.getItem("currentTheme"));
      setTheme(currentTheme.main, currentTheme.mainBg, currentTheme.itemMain);
    }
  });
}

/* Footer */

function changeHeaderContentForCompletedTasks() {
  let heading = taskListHeaderContent.querySelector(".task-list__h1");
  heading.style.textTransform = "capitalize";
  heading.textContent = "Completed Tasks";
  let headerCalendar = taskListHeaderContent.querySelector(".task-list__date");
  headerCalendar.style.display = "none";
}

function changeHeaderContentForAllTasks() {
  let heading = taskListHeaderContent.querySelector(".task-list__h1");
  heading.style.textTransform = "uppercase";
  heading.textContent = "Todo App";

  let headerCalendar = taskListHeaderContent.querySelector(".task-list__date");
  headerCalendar.style.display = "block";
}

function turnToAllTasksList() {
  changeHeaderContentForAllTasks();
  allTasksBtn.classList.remove("disabled");
  completedTasksBtn.classList.add("disabled");

  taskListSlider.scrollLeft -=
    taskListSliderWrapper.offsetWidth - taskListSlider.offsetWidth;
}

function turnToCompletedTasksList() {
  changeHeaderContentForCompletedTasks();
  completedTasksBtn.classList.remove("disabled");
  allTasksBtn.classList.add("disabled");

  taskListSlider.scrollLeft =
    taskListSliderWrapper.offsetWidth - taskListSlider.offsetWidth;
}

allTasksBtn.addEventListener("click", turnToAllTasksList);

completedTasksBtn.addEventListener("click", turnToCompletedTasksList);

allTasksList.addEventListener("mouseover", turnToAllTasksList);

completedTasks.addEventListener("mouseover", turnToCompletedTasksList);

allTasksList.addEventListener("touchmove", turnToCompletedTasksList);

completedTasks.addEventListener("touchmove", turnToAllTasksList);

/* Add Task Section */

/* Add Task */

function getTaskTemplate(
  title = taskTitle.value,
  description = taskDescription.value
) {
  if (title === "") {
    title = "Todo title";
  }

  if (description === "") {
    description = "Todo decription";
  }

  let el = document.createElement("div");
  el.classList.add("task-list__item");
  el.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="task-list__item-head">
      <h2 class="task-list__item-heading">${title}</h2>
      <p class="task-list__item-text">${description}</p>
    </div>
    <nav class="task-list__item-nav">
      <svg class="task-list__btn-pencil-wrapper" width="20" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="edit">
        <path class="task-list__btn-pencil" d="M8.30294 4.27086C8.56199 3.94765 8.50997 3.47563 8.18675 3.21659C7.86354 2.95754 7.39152 3.00956 7.13248 3.33277L8.30294 4.27086ZM1.57396 11.4674L2.14199 11.9572C2.14785 11.9504 2.15358 11.9435 2.15919 11.9365L1.57396 11.4674ZM1.39583 11.9029L0.64729 11.854L0.646636 11.8682L1.39583 11.9029ZM1.25 15.0518L0.500803 15.0171C0.499078 15.0544 0.500133 15.0917 0.503958 15.1288L1.25 15.0518ZM2.06979 15.7674L2.09431 16.517C2.14433 16.5154 2.19406 16.5088 2.24275 16.4972L2.06979 15.7674ZM5.19479 15.0268L5.36777 15.7567L5.37941 15.7537L5.19479 15.0268ZM5.59583 14.7727L6.17444 15.25L6.18094 15.2419L5.59583 14.7727ZM12.4726 7.39602C12.7317 7.07288 12.6798 6.60085 12.3567 6.34171C12.0336 6.08258 11.5615 6.13447 11.3024 6.45761L12.4726 7.39602ZM7.13576 3.33258C6.8766 3.6557 6.92846 4.12774 7.25159 4.38689C7.57472 4.64605 8.04675 4.59419 8.30591 4.27106L7.13576 3.33258ZM9.375 1.73932L9.96007 2.20856C9.96993 2.19627 9.9794 2.18367 9.98846 2.17078L9.375 1.73932ZM11.0719 1.40598L11.5517 0.829544C11.5278 0.809663 11.5027 0.791286 11.4765 0.774518L11.0719 1.40598ZM13.4021 3.34557L13.9329 2.81573C13.9166 2.79942 13.8996 2.78387 13.8819 2.76913L13.4021 3.34557ZM13.7531 4.20065L14.503 4.20477L14.503 4.20477L13.7531 4.20065ZM13.3927 5.05182L12.8677 4.51618C12.8465 4.53701 12.8265 4.55909 12.8079 4.58231L13.3927 5.05182ZM11.3026 6.45731C11.0433 6.78031 11.095 7.25237 11.418 7.51168C11.741 7.77098 12.2131 7.71934 12.4724 7.39633L11.3026 6.45731ZM8.46255 3.69067C8.40117 3.28103 8.01932 2.99871 7.60968 3.0601C7.20004 3.12148 6.91773 3.50333 6.97911 3.91297L8.46255 3.69067ZM11.9885 7.66999C12.3989 7.61422 12.6864 7.23628 12.6307 6.82584C12.5749 6.4154 12.197 6.12788 11.7865 6.18365L11.9885 7.66999ZM7.13248 3.33277L0.988726 10.9984L2.15919 11.9365L8.30294 4.27086L7.13248 3.33277ZM1.00593 10.9777C0.794362 11.2231 0.668508 11.5307 0.647423 11.8541L2.14424 11.9517C2.14411 11.9537 2.14332 11.9556 2.14199 11.9572L1.00593 10.9777ZM0.646636 11.8682L0.500803 15.0171L1.9992 15.0865L2.14503 11.9376L0.646636 11.8682ZM0.503958 15.1288C0.587353 15.9373 1.28192 16.5436 2.09431 16.517L2.04527 15.0178C2.02012 15.0187 1.99862 14.9999 1.99604 14.9749L0.503958 15.1288ZM2.24275 16.4972L5.36775 15.7566L5.02183 14.297L1.89683 15.0377L2.24275 16.4972ZM5.37941 15.7537C5.69121 15.6745 5.96967 15.4981 6.17438 15.2499L5.01728 14.2954C5.01545 14.2976 5.01296 14.2992 5.01017 14.2999L5.37941 15.7537ZM6.18094 15.2419L12.4726 7.39602L11.3024 6.45761L5.01073 14.3034L6.18094 15.2419ZM8.30591 4.27106L9.96007 2.20856L8.78993 1.27008L7.13576 3.33258L8.30591 4.27106ZM9.98846 2.17078C10.1425 1.95176 10.4418 1.89297 10.6672 2.03745L11.4765 0.774518C10.5747 0.196613 9.37772 0.431753 8.76154 1.30785L9.98846 2.17078ZM10.5921 1.98242L12.9223 3.92201L13.8819 2.76913L11.5517 0.829544L10.5921 1.98242ZM12.8713 3.87541C12.9563 3.96058 13.0037 4.07619 13.0031 4.19653L14.503 4.20477C14.5059 3.68424 14.3006 3.18414 13.9329 2.81573L12.8713 3.87541ZM13.0031 4.19653C13.0024 4.31686 12.9537 4.43194 12.8677 4.51618L13.9177 5.58746C14.2894 5.22311 14.5002 4.7253 14.503 4.20477L13.0031 4.19653ZM12.8079 4.58231L11.3026 6.45731L12.4724 7.39633L13.9776 5.52133L12.8079 4.58231ZM6.97911 3.91297C7.34049 6.32449 9.57223 7.9983 11.9885 7.66999L11.7865 6.18365C10.1832 6.4015 8.70234 5.29084 8.46255 3.69067L6.97911 3.91297Z"/>
      </svg>
      <svg class="task-list__btn-trash-wrapper" width="20" height="20" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="trash">
        <path class="task-list__btn-trash" fill-rule="evenodd" clip-rule="evenodd" d="M10.8406 5.37512H2.15936C1.68014 5.37512 1.29166 5.76361 1.29166 6.24283V13.1876C1.29166 14.6259 2.45758 15.7918 3.89582 15.7918H9.10416C9.79483 15.7918 10.4572 15.5174 10.9456 15.029C11.434 14.5407 11.7083 13.8783 11.7083 13.1876V6.24283C11.7083 5.76361 11.3198 5.37512 10.8406 5.37512Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="task-list__btn-trash" fill-rule="evenodd" clip-rule="evenodd" d="M9.625 3.29173L9.51458 3.07194C8.94365 1.9298 7.77637 1.20831 6.49948 1.20831C5.22259 1.20831 4.05531 1.9298 3.48437 3.07194L3.375 3.29173H9.625Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="task-list__btn-trash-fill" d="M5.51353 8.84696C5.51353 8.43274 5.17775 8.09696 4.76353 8.09696C4.34932 8.09696 4.01353 8.43274 4.01353 8.84696H5.51353ZM4.01353 12.3188C4.01353 12.733 4.34932 13.0688 4.76353 13.0688C5.17775 13.0688 5.51353 12.733 5.51353 12.3188H4.01353ZM8.98645 8.84696C8.98645 8.43274 8.65066 8.09696 8.23645 8.09696C7.82223 8.09696 7.48645 8.43274 7.48645 8.84696H8.98645ZM7.48645 12.3188C7.48645 12.733 7.82223 13.0688 8.23645 13.0688C8.65066 13.0688 8.98645 12.733 8.98645 12.3188H7.48645ZM9.62499 2.54175C9.21078 2.54175 8.87499 2.87753 8.87499 3.29175C8.87499 3.70596 9.21078 4.04175 9.62499 4.04175V2.54175ZM11.7083 4.04175C12.1225 4.04175 12.4583 3.70596 12.4583 3.29175C12.4583 2.87753 12.1225 2.54175 11.7083 2.54175V4.04175ZM3.37499 4.04175C3.7892 4.04175 4.12499 3.70596 4.12499 3.29175C4.12499 2.87753 3.7892 2.54175 3.37499 2.54175V4.04175ZM1.29166 2.54175C0.877443 2.54175 0.541656 2.87753 0.541656 3.29175C0.541656 3.70596 0.877443 4.04175 1.29166 4.04175V2.54175ZM4.01353 8.84696V12.3188H5.51353V8.84696H4.01353ZM7.48645 8.84696V12.3188H8.98645V8.84696H7.48645ZM9.62499 4.04175H11.7083V2.54175H9.62499V4.04175ZM3.37499 2.54175H1.29166V4.04175H3.37499V2.54175Z" fill="#B3B7EE"/>
      </svg>
      <svg class="task-list__btn-done-wrapper" width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="done">
        <path class="task-list__btn-done" fill-rule="evenodd" clip-rule="evenodd" d="M1.20834 8.50017C1.20859 5.02152 3.6661 2.02747 7.07795 1.34905C10.4898 0.670623 13.9058 2.49678 15.2368 5.71072C16.5678 8.92465 15.4432 12.6313 12.5507 14.5637C9.6582 16.4962 5.80341 16.1163 3.34376 13.6564C1.97634 12.2889 1.2082 10.4341 1.20834 8.50017Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="task-list__btn-done" d="M4.85419 8.50015L7.2844 10.9304L12.1459 6.06995" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </nav>
  `
  );

  return el;
}

function makeCompletedTaskFromTemlate(el) {
  let editBtn = el.querySelector(".task-list__btn-pencil-wrapper");
  let doneBtn = el.querySelector(".task-list__btn-done-wrapper");

  editBtn.remove();
  doneBtn.remove();

  const navBtnsContainer = el.querySelector(".task-list__item-nav");

  navBtnsContainer.insertAdjacentHTML(
    "afterbegin",
    `
    <svg data-action="undone" class="task-list__btn-unDone" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="circleArrowLeftIconTitle" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000">
      <path d="M10.5 15l-3-3 3-3"/> 
      <path d="M16.5 12H9"/> 
      <path stroke-linecap="round" d="M7.5 12H9"/> 
      <circle cx="12" cy="12" r="10"/> 
    </svg>`
  );

  return el;
}

function makeUncompletedTaskFromTemplate(el) {
  const navBtnsContainer = el.querySelector(".task-list__item-nav");

  const undoneBtn = el.querySelector(".task-list__btn-unDone");
  undoneBtn.remove();

  navBtnsContainer.insertAdjacentHTML(
    "afterbegin",
    `
      <svg class="task-list__btn-pencil-wrapper" width="20" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="edit">
        <path class="task-list__btn-pencil" d="M8.30294 4.27086C8.56199 3.94765 8.50997 3.47563 8.18675 3.21659C7.86354 2.95754 7.39152 3.00956 7.13248 3.33277L8.30294 4.27086ZM1.57396 11.4674L2.14199 11.9572C2.14785 11.9504 2.15358 11.9435 2.15919 11.9365L1.57396 11.4674ZM1.39583 11.9029L0.64729 11.854L0.646636 11.8682L1.39583 11.9029ZM1.25 15.0518L0.500803 15.0171C0.499078 15.0544 0.500133 15.0917 0.503958 15.1288L1.25 15.0518ZM2.06979 15.7674L2.09431 16.517C2.14433 16.5154 2.19406 16.5088 2.24275 16.4972L2.06979 15.7674ZM5.19479 15.0268L5.36777 15.7567L5.37941 15.7537L5.19479 15.0268ZM5.59583 14.7727L6.17444 15.25L6.18094 15.2419L5.59583 14.7727ZM12.4726 7.39602C12.7317 7.07288 12.6798 6.60085 12.3567 6.34171C12.0336 6.08258 11.5615 6.13447 11.3024 6.45761L12.4726 7.39602ZM7.13576 3.33258C6.8766 3.6557 6.92846 4.12774 7.25159 4.38689C7.57472 4.64605 8.04675 4.59419 8.30591 4.27106L7.13576 3.33258ZM9.375 1.73932L9.96007 2.20856C9.96993 2.19627 9.9794 2.18367 9.98846 2.17078L9.375 1.73932ZM11.0719 1.40598L11.5517 0.829544C11.5278 0.809663 11.5027 0.791286 11.4765 0.774518L11.0719 1.40598ZM13.4021 3.34557L13.9329 2.81573C13.9166 2.79942 13.8996 2.78387 13.8819 2.76913L13.4021 3.34557ZM13.7531 4.20065L14.503 4.20477L14.503 4.20477L13.7531 4.20065ZM13.3927 5.05182L12.8677 4.51618C12.8465 4.53701 12.8265 4.55909 12.8079 4.58231L13.3927 5.05182ZM11.3026 6.45731C11.0433 6.78031 11.095 7.25237 11.418 7.51168C11.741 7.77098 12.2131 7.71934 12.4724 7.39633L11.3026 6.45731ZM8.46255 3.69067C8.40117 3.28103 8.01932 2.99871 7.60968 3.0601C7.20004 3.12148 6.91773 3.50333 6.97911 3.91297L8.46255 3.69067ZM11.9885 7.66999C12.3989 7.61422 12.6864 7.23628 12.6307 6.82584C12.5749 6.4154 12.197 6.12788 11.7865 6.18365L11.9885 7.66999ZM7.13248 3.33277L0.988726 10.9984L2.15919 11.9365L8.30294 4.27086L7.13248 3.33277ZM1.00593 10.9777C0.794362 11.2231 0.668508 11.5307 0.647423 11.8541L2.14424 11.9517C2.14411 11.9537 2.14332 11.9556 2.14199 11.9572L1.00593 10.9777ZM0.646636 11.8682L0.500803 15.0171L1.9992 15.0865L2.14503 11.9376L0.646636 11.8682ZM0.503958 15.1288C0.587353 15.9373 1.28192 16.5436 2.09431 16.517L2.04527 15.0178C2.02012 15.0187 1.99862 14.9999 1.99604 14.9749L0.503958 15.1288ZM2.24275 16.4972L5.36775 15.7566L5.02183 14.297L1.89683 15.0377L2.24275 16.4972ZM5.37941 15.7537C5.69121 15.6745 5.96967 15.4981 6.17438 15.2499L5.01728 14.2954C5.01545 14.2976 5.01296 14.2992 5.01017 14.2999L5.37941 15.7537ZM6.18094 15.2419L12.4726 7.39602L11.3024 6.45761L5.01073 14.3034L6.18094 15.2419ZM8.30591 4.27106L9.96007 2.20856L8.78993 1.27008L7.13576 3.33258L8.30591 4.27106ZM9.98846 2.17078C10.1425 1.95176 10.4418 1.89297 10.6672 2.03745L11.4765 0.774518C10.5747 0.196613 9.37772 0.431753 8.76154 1.30785L9.98846 2.17078ZM10.5921 1.98242L12.9223 3.92201L13.8819 2.76913L11.5517 0.829544L10.5921 1.98242ZM12.8713 3.87541C12.9563 3.96058 13.0037 4.07619 13.0031 4.19653L14.503 4.20477C14.5059 3.68424 14.3006 3.18414 13.9329 2.81573L12.8713 3.87541ZM13.0031 4.19653C13.0024 4.31686 12.9537 4.43194 12.8677 4.51618L13.9177 5.58746C14.2894 5.22311 14.5002 4.7253 14.503 4.20477L13.0031 4.19653ZM12.8079 4.58231L11.3026 6.45731L12.4724 7.39633L13.9776 5.52133L12.8079 4.58231ZM6.97911 3.91297C7.34049 6.32449 9.57223 7.9983 11.9885 7.66999L11.7865 6.18365C10.1832 6.4015 8.70234 5.29084 8.46255 3.69067L6.97911 3.91297Z"/>
      </svg>
  `
  );

  navBtnsContainer.insertAdjacentHTML(
    "beforeend",
    `
    <svg class="task-list__btn-done-wrapper" width="20" height="20" viewBox="0 0 17 17"   fill="none" xmlns="http://www.w3.org/2000/svg" data-action="done">
      <path class="task-list__btn-done" fill-rule="evenodd" clip-rule="evenodd" d="M1.20834 8.50017C1.20859 5.02152 3.6661 2.02747 7.07795 1.34905C10.4898 0.670623 13.9058 2.49678 15.2368 5.71072C16.5678 8.92465 15.4432 12.6313 12.5507 14.5637C9.6582 16.4962 5.80341 16.1163 3.34376 13.6564C1.97634 12.2889 1.2082 10.4341 1.20834 8.50017Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="task-list__btn-done" d="M4.85419 8.50015L7.2844 10.9304L12.1459 6.06995" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
  );

  return el;
}

taskBtnAdd.addEventListener("click", addTask);

function addTask() {
  let newTask = getTaskTemplate();

  allTasksList.append(newTask);
  hideAllTaskText();
  indexAllTasks(); // add data-index to task

  showAndHideAddTaskWarning();

  /* Clear Add Task Inputs */
  taskTitle.value = "";
  taskDescription.value = "";

  safeAllTasks();
}

addTaskBtnBack.addEventListener("click", closeAddTaskPage);

function closeAddTaskPage() {
  addTaskPage.style.animation = "hide .3s";
  setTimeout(function () {
    addTaskPage.style.display = "none";
  }, 100);
}

function showAndHideAddTaskWarning() {
  addTaskWarning.style.animation = "showFromTop .3s";
  addTaskWarning.style.display = "block";
  setTimeout(function () {
    addTaskWarning.style.top = "50px";
  }, 100);
  setTimeout(function () {
    addTaskWarning.style.animation = "easyHide .3s";
  }, 1500);

  setTimeout(function () {
    addTaskWarning.style.display = "none";
  }, 1700);
}

/* Edit Task */

const editTaskPage = document.getElementById("edit-task-page");

const backBtnAtEditPage = document.getElementById("edit-task-btn-back");
const editTaskBtn = document.getElementById("task-btn-edit");

function startEditTask() {
  if (editTaskPage.style.display !== "flex") {
    editTaskPage.style.display = "flex";
    editTaskPage.style.animation = "show .3s";
  }
}

function closeEditTaskPage() {
  editTaskPage.style.animation = "hide .35s";
  setTimeout(function () {
    editTaskPage.style.display = "none";
  }, 300);
}

backBtnAtEditPage.addEventListener("click", function () {
  closeEditTaskPage();
});

function getCurrentTaskValues() {
  const currentTask = allTasksList.querySelector('[data-active="active"]');
  const currentTitle = currentTask.querySelector(".task-list__item-heading");
  const currentDescription = currentTask.querySelector(".task-list__item-text");

  editTaskTitle.value = currentTitle.textContent;
  editTaskDescription.value = currentDescription.textContent;

  if (currentTitle.textContent === "Todo title") {
    editTaskTitle.value = "";
  }

  if (currentDescription.textContent === "Todo decription") {
    editTaskDescription.value = "";
  }
}

function setEditTaskValues() {
  setTimeout(function () {
    const currentTask = allTasksList.querySelector('[data-active="active"]');

    const currentTitle = currentTask.querySelector(".task-list__item-heading");
    const currentDescription = currentTask.querySelector(
      ".task-list__item-text"
    );

    /* New Edit Task */
    currentTitle.textContent = editTaskTitle.value;
    currentDescription.textContent = editTaskDescription.value;

    if (currentTitle.textContent === "") {
      currentTitle.textContent = "Todo title";
    }

    if (currentDescription.textContent === "") {
      currentDescription.textContent = "Todo decription";
    }

    /* Clear Edit Task Inputs */
    editTaskTitle.value = "";
    editTaskDescription.value = "";

    safeAllTasks();
  }, 10);
}

function clearAllDataActiveAttrs() {
  allTasksList.childNodes.forEach(function (task) {
    task.removeAttribute("data-active", "active");
  });

  completedTasks.childNodes.forEach(function (task) {
    task.removeAttribute("data-active", "active");
  });
}

editTaskBtn.addEventListener("click", function () {
  setEditTaskValues();
  closeEditTaskPage();
});

/* Safe All Tasks */

function safeAllTasks() {
  localStorage.setItem("allTasks", `${allTasksList.innerHTML}`);
}

/* Safe Completed Tasks */

function safeCompletedTasks() {
  localStorage.setItem("completedTasks", `${completedTasks.innerHTML}`);
}

/* Show All and Completed Tasks */

function showTasks() {
  if (localStorage.getItem("allTasks") === null) return;
  if (localStorage.getItem("completedTasks") === null) return;

  allTasksList.innerHTML = localStorage.getItem("allTasks");
  completedTasks.innerHTML = localStorage.getItem("completedTasks");
}

showTasks();

/* Index All Tasks */

function indexAllTasks() {
  allTasksList.childNodes.forEach(function (task, index) {
    task.dataset.index = index;
  });
}

indexAllTasks();

/* Index All Tasks after undone btn */

function indexAfterUndoneBtn(undoneTask, personalIndex) {
  let allTasksListArr = Array.from(allTasksList.childNodes);
  allTasksListArr.splice(personalIndex, 0, undoneTask);
  allTasksList.childNodes.forEach(function (el) {
    el.remove();
    allTasksListArr.forEach((el) => allTasksList.append(el));
  });
}

/* Show and Hide text while no task */

function showAllTaskText() {
  const allTaskText = document.createElement("p");
  allTaskText.classList.add("task-list__empty-all-tasks-text");
  allTaskText.textContent = "Nothing to do";

  if (allTasksList.childNodes.length === 0) {
    allTasksList.append(allTaskText);
    safeAllTasks();
  }
}

function showCompletedTaskText() {
  const completedTasksText = document.createElement("p");
  completedTasksText.textContent = "Nothing completed";
  completedTasksText.classList.add("task-list__empty-completed-tasks-text");

  if (completedTasks.childNodes.length === 0) {
    completedTasks.append(completedTasksText);
    safeCompletedTasks();
  }
}

function hideAllTaskText() {
  const textToHide = document.querySelector(".task-list__empty-all-tasks-text");

  if (textToHide === null) {
    return;
  } else textToHide.remove();

  safeAllTasks();
}

function hideCompletedTaskText() {
  const textToHide = document.querySelector(
    ".task-list__empty-completed-tasks-text"
  );

  if (textToHide === null) {
    return;
  } else textToHide.remove();

  safeCompletedTasks();
}

/* Keyboard Btns Clcks */

function enterClick() {
  window.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      taskAddBtn;
      console.log(taskAddBtn.querySelector(".task-list__add-btn-plus"));
      if (addTaskPage.style.display === "flex") {
        addTask();
        safeAllTasks();
      }

      if (editTaskPage.style.display === "flex") {
        setEditTaskValues();
        closeEditTaskPage();
        safeAllTasks();
      }
    }
  });
}

enterClick();
