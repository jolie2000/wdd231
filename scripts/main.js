const courses = [
  { subject: "PC", number: 101, title: "Life Skills", credits: 2, completed: true },
  { subject: "REL", number: "250A", title: "Jesus Christ & His Everlasting Gospel", credits: 2, completed: true },
  { subject: "PC", number: 102, title: "Professional Skills", credits: 2, completed: true },
  { subject: "REL", number: "250B", title: "Jesus Christ & His Everlasting Gospel", credits: 2, completed: true },
  { subject: "PC", number: 103, title: "University Skills", credits: 2, completed: true },
  { subject: "CSE", number: 110, title: "Introduction to Programming", credits: 2, completed: true },
  { subject: "REL", number: "275A", title: "Teachings and Doctrine of the Book of Mormon", credits: 2, completed: true },
  { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, completed: true },
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, completed: true },
  { subject: "REL", number: "275B", title: "Teachings & Doctrine of the Book of Mormon", credits: 2, completed: true },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, completed: false },
  { subject: "MATH", number: "108X", title: "Math for the Real World", credits: 2, completed: false },
  { subject: "WDD", number: 231, title: "Web Frontend Development I", credits: 3, completed: false }
];

const courseList = document.querySelector("#course-list");
const creditTotal = document.querySelector("#credit-total");
const filterButtons = document.querySelectorAll("[data-filter]");

function renderCourses(filter = "all") {
  const visibleCourses = filter === "all" ? courses : courses.filter((course) => course.subject === filter);
  courseList.innerHTML = visibleCourses.length
    ? visibleCourses.map((course) => `
      <article class="course-card${course.completed ? " completed" : ""}">
        <div class="course-top">
          <span class="course-code">${course.subject} ${course.number}</span>
          <span class="course-status${course.completed ? "" : " current"}">${course.completed ? "Completed" : "In progress"}</span>
        </div>
        <h3>${course.title}</h3>
        <p>${course.credits} credit${course.credits === 1 ? "" : "s"}</p>
      </article>`).join("")
    : '<p class="empty-state">No courses match this filter yet.</p>';
  creditTotal.textContent = visibleCourses.reduce((total, course) => total + course.credits, 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", isActive);
    });
    renderCourses(button.dataset.filter);
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.querySelector(".sr-only").textContent = isOpen ? "Close navigation menu" : "Open navigation menu";
});

document.querySelector("#copyright-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent = document.lastModified;
renderCourses();
