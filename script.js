// Global variables
let currentUser = null;
let events = JSON.parse(localStorage.getItem("events")) || [
  {
    id: 1,
    name: "Tech Fest 2023",
    date: "2023-11-15",
    category: "technical",
    location: "Main Auditorium",
    time: "10:00 AM - 4:00 PM",
    description:
      "Annual technical festival featuring coding competitions, robotics demonstrations, and tech talks by industry experts.",
    department: "cse",
    participants: 150,
    status: "active",
    image: "https://via.placeholder.com/300x200/3498db/ffffff?text=Tech+Fest",
  },
  {
    id: 2,
    name: "Cultural Night",
    date: "2023-11-20",
    category: "cultural",
    location: "College Ground",
    time: "6:00 PM - 10:00 PM",
    description:
      "An evening of music, dance, and cultural performances showcasing the diverse talents of our students.",
    department: "ec",
    participants: 200,
    status: "active",
    image:
      "https://via.placeholder.com/300x200/e74c3c/ffffff?text=Cultural+Night",
  },
  {
    id: 3,
    name: "Sports Tournament",
    date: "2023-11-25",
    category: "sports",
    location: "Sports Complex",
    time: "9:00 AM - 5:00 PM",
    description:
      "Inter-department sports competition featuring cricket, football, basketball, and athletics.",
    department: "mech",
    participants: 120,
    status: "upcoming",
    image: "https://via.placeholder.com/300x200/2ecc71/ffffff?text=Sports",
  },
];

let certificates = JSON.parse(localStorage.getItem("certificates")) || [];
let registeredEvents =
  JSON.parse(localStorage.getItem("registeredEvents")) || [];

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  loadUserData();
  updateUI();
  loadPageSpecificContent();
});

// Load user from localStorage (bridges login page.html and script.js)
function loadUserData() {
  // Try currentUser first (set by modal login)
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    try { currentUser = JSON.parse(stored); return; } catch(e) {}
  }
  // Fall back to loggedInUser (set by login page.html)
  const loggedIn = localStorage.getItem("loggedInUser");
  if (loggedIn) {
    currentUser = {
      username: loggedIn,
      type: loggedIn === "admin" ? "admin" : loggedIn === "organizer" ? "organizer" : "student",
      id: "user_" + loggedIn,
      email: loggedIn + "@meca.ac.in",
      studentId: null,
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

function initializeApp() {
  // Initialize localStorage data if not exists
  if (!localStorage.getItem("events")) {
    localStorage.setItem("events", JSON.stringify(events));
  }
  if (!localStorage.getItem("certificates")) {
    localStorage.setItem("certificates", JSON.stringify(certificates));
  }
  if (!localStorage.getItem("registeredEvents")) {
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
  }

  // Load data from localStorage
  events = JSON.parse(localStorage.getItem("events")) || events;
  certificates =
    JSON.parse(localStorage.getItem("certificates")) || certificates;
  registeredEvents =
    JSON.parse(localStorage.getItem("registeredEvents")) || registeredEvents;
}

function setupEventListeners() {
  // Login Modal
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = document.querySelector(".close");
  const registerLink = document.getElementById("registerLink");

  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentUser) {
        showUserMenu();
      } else {
        window.location.href = "login page.html";
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (loginModal) loginModal.style.display = "none";
    });
  }

  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      showRegistrationForm();
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    const loginModal = document.getElementById("loginModal");
    const addEventModal = document.getElementById("addEventModal");
    const registrationModal = document.getElementById("registrationModal");

    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (e.target === addEventModal) {
      addEventModal.style.display = "none";
    }
    if (e.target === registrationModal) {
      registrationModal.style.display = "none";
    }
  });

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin();
    });
  }

  // Admin Dashboard Tabs
  const adminNavBtns = document.querySelectorAll(".admin-nav-btn");
  adminNavBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchAdminTab(tabId);
    });
  });

  // Add Event Modal
  const addEventBtn = document.getElementById("addEventBtn");
  const addEventModal = document.getElementById("addEventModal");
  const addEventForm = document.getElementById("addEventForm");

  if (addEventBtn && addEventModal) {
    addEventBtn.addEventListener("click", function () {
      addEventModal.style.display = "block";
    });

    const closeAddEvent = addEventModal.querySelector(".close");
    if (closeAddEvent) {
      closeAddEvent.addEventListener("click", function () {
        addEventModal.style.display = "none";
      });
    }
  }

  if (addEventForm) {
    addEventForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleAddEvent();
    });
  }

  // Event Filter Functionality
  const applyFiltersBtn = document.getElementById("applyFilters");
  const resetFiltersBtn = document.getElementById("resetFilters");

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", function () {
      applyEventFilters();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function () {
      resetEventFilters();
    });
  }

  // Certificate Filter
  const certificateFilter = document.getElementById("certificateFilter");
  if (certificateFilter) {
    certificateFilter.addEventListener("change", function () {
      filterCertificates(this.value);
    });
  }

  // Generate Certificates Button
  const generateCertificatesBtn = document.getElementById(
    "generateCertificatesBtn"
  );
  if (generateCertificatesBtn) {
    generateCertificatesBtn.addEventListener("click", function () {
      generateCertificates();
    });
  }

  // Search functionality
  const searchCertificatesBtn = document.getElementById(
    "searchCertificatesBtn"
  );
  if (searchCertificatesBtn) {
    searchCertificatesBtn.addEventListener("click", function () {
      searchCertificates();
    });
  }

  const searchParticipantsBtn = document.getElementById(
    "searchParticipantsBtn"
  );
  if (searchParticipantsBtn) {
    searchParticipantsBtn.addEventListener("click", function () {
      searchParticipants();
    });
  }

  // Chatbot Functionality
  setupChatbot();

  // Register Now button on homepage
  const registerNowBtn = document.querySelector(".register-now-btn");
  if (registerNowBtn) {
    registerNowBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentUser) {
        window.location.href = "events.html";
      } else {
        window.location.href = "login page.html";
      }
      }
    });
  }

  // Certificate actions
  const downloadCertificateBtn = document.getElementById(
    "downloadCertificateBtn"
  );
  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener("click", function () {
      downloadCertificate();
    });
  }

  const printCertificateBtn = document.getElementById("printCertificateBtn");
  if (printCertificateBtn) {
    printCertificateBtn.addEventListener("click", function () {
      printCertificate();
    });
  }

  // Setup event registration buttons
  setupEventRegistration();
}

function loadPageSpecificContent() {
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "events.html":
      displayEvents();
      break;
    case "admin.html":
      if (currentUser && currentUser.type === "admin") {
        loadAdminData();
      }
      break;
    case "certificate.html":
      loadUserCertificates();
      break;
    case "chatbot.html":
      // Chatbot is already setup
      break;
    default:
      // Homepage - no specific content needed
      break;
  }
}

// User Management
function handleLogin() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const userTypeInput = document.getElementById("userType");

  if (!usernameInput || !passwordInput || !userTypeInput) return;

  const username = usernameInput.value;
  const password = passwordInput.value;
  const userType = userTypeInput.value;

  if (username && password) {
    currentUser = {
      username: username,
      type: userType,
      id: Date.now().toString(),
      email: username + "@gweca.ac.in",
      studentId:
        userType === "student"
          ? "22" +
            username.slice(0, 2).toUpperCase() +
            Math.floor(Math.random() * 1000)
          : null,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showNotification("Welcome back, " + username + "!", "success");
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.style.display = "none";

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.reset();

    updateUI();
    loadPageSpecificContent();

    // Redirect based on user type
    if (
      userType === "admin" &&
      !window.location.pathname.includes("admin.html")
    ) {
      window.location.href = "admin.html";
    }
  } else {
    showNotification("Please enter both username and password", "error");
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("loggedInUser");
  showNotification("Logged out successfully", "success");
  updateUI();
  loadPageSpecificContent();
}

function showUserMenu() {
  // Remove existing menu if any
  const existingMenu = document.querySelector(".user-menu");
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const userMenu = document.createElement("div");
  userMenu.className = "user-menu";
  userMenu.innerHTML =
    '<div class="user-info"><strong>' +
    currentUser.username +
    "</strong><span>(" +
    currentUser.type +
    ')</span></div><button onclick="handleLogout()" class="btn small danger">Logout</button>';

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.parentNode.insertBefore(userMenu, loginBtn.nextSibling);
  }
}

function showRegistrationForm() {
  const registrationForm =
    '<div class="modal" id="registrationModal"><div class="modal-content"><span class="close" onclick="closeModal(\'registrationModal\')">&times;</span><h2>Student Registration</h2><form id="registrationForm"><div class="form-group"><label for="regName">Full Name</label><input type="text" id="regName" required></div><div class="form-group"><label for="regEmail">Email</label><input type="email" id="regEmail" required></div><div class="form-group"><label for="regStudentId">Student ID</label><input type="text" id="regStudentId" required></div><div class="form-group"><label for="regDepartment">Department</label><select id="regDepartment" required><option value="cse">Computer Science</option><option value="ec">Electronics</option><option value="mech">Mechanical</option><option value="civil">Civil</option></select></div><div class="form-group"><label for="regPassword">Password</label><input type="password" id="regPassword" required></div><button type="submit" class="btn primary">Register</button></form></div></div>';

  document.body.insertAdjacentHTML("beforeend", registrationForm);
  document.getElementById("registrationModal").style.display = "block";

  document
    .getElementById("registrationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      handleStudentRegistration();
    });
}

function handleStudentRegistration() {
  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const studentIdInput = document.getElementById("regStudentId");
  const departmentInput = document.getElementById("regDepartment");

  if (!nameInput || !emailInput || !studentIdInput || !departmentInput) return;

  const name = nameInput.value;
  const email = emailInput.value;
  const studentId = studentIdInput.value;
  const department = departmentInput.value;

  // In a real app, this would be sent to a server
  showNotification("Registration successful! Welcome " + name, "success");
  closeModal("registrationModal");

  // Auto login after registration
  currentUser = {
    username: name,
    email: email,
    studentId: studentId,
    department: department,
    type: "student",
    id: Date.now().toString(),
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateUI();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    modal.remove();
  }
}

// Event Management
function setupEventRegistration() {
  // Event registration buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("register-event-btn")) {
      e.preventDefault();
      const eventId = e.target.getAttribute("data-event-id");
      registerForEvent(parseInt(eventId));
    }

    if (e.target.classList.contains("view-details-btn")) {
      e.preventDefault();
      const eventId = e.target.getAttribute("data-event-id");
      viewEventDetails(parseInt(eventId));
    }

    if (e.target.classList.contains("edit-event-btn")) {
      e.preventDefault();
      const eventId = e.target.getAttribute("data-event-id");
      editEvent(parseInt(eventId));
    }

    if (e.target.classList.contains("delete-event-btn")) {
      e.preventDefault();
      const eventId = e.target.getAttribute("data-event-id");
      deleteEvent(parseInt(eventId));
    }

    if (e.target.classList.contains("mark-attendance-btn")) {
      e.preventDefault();
      const participantId = e.target.getAttribute("data-participant-id");
      markAttendance(participantId);
    }

    if (e.target.classList.contains("view-certificate-btn")) {
      e.preventDefault();
      const certificateId = e.target.getAttribute("data-certificate-id");
      viewCertificate(certificateId);
    }

    if (e.target.classList.contains("download-certificate-btn")) {
      e.preventDefault();
      const certificateId = e.target.getAttribute("data-certificate-id");
      downloadCertificate();
    }
  });
}

function displayEvents() {
  const eventsContainer = document.getElementById("eventsContainer");
  if (!eventsContainer) return;

  let eventsHTML = "";
  events.forEach(function (event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const category =
      event.category.charAt(0).toUpperCase() + event.category.slice(1);
    const isRegistered = isRegisteredForEvent(event.id);

    eventsHTML +=
      '<div class="event-card detailed"><div class="event-image"><img src="' +
      event.image +
      '" alt="' +
      event.name +
      '"></div><div class="event-date"><span class="day">' +
      day +
      '</span><span class="month">' +
      month +
      '</span></div><div class="event-info"><h3>' +
      event.name +
      '</h3><p class="event-category ' +
      event.category +
      '">' +
      category +
      '</p><p><i class="fas fa-map-marker-alt"></i> ' +
      event.location +
      '</p><p><i class="fas fa-clock"></i> ' +
      event.time +
      '</p><p class="event-description">' +
      event.description +
      '</p><div class="event-actions"><button class="btn primary register-event-btn" data-event-id="' +
      event.id +
      '">' +
      (isRegistered ? "Registered" : "Register") +
      '</button><button class="btn secondary view-details-btn" data-event-id="' +
      event.id +
      '">More Details</button></div></div></div>';
  });

  eventsContainer.innerHTML = eventsHTML;
}

function registerForEvent(eventId) {
  if (!currentUser) {
    showNotification("Please login to register for events", "error");
    setTimeout(function() { window.location.href = "login page.html"; }, 1000);
    return;
  }

  const event = events.find(function (e) {
    return e.id === eventId;
  });
  if (event) {
    // Check if already registered
    if (
      registeredEvents.some(function (re) {
        return re.eventId === eventId && re.userId === currentUser.id;
      })
    ) {
      showNotification("You are already registered for this event", "warning");
      return;
    }

    const registration = {
      id: Date.now().toString(),
      eventId: eventId,
      userId: currentUser.id,
      userName: currentUser.username,
      userEmail: currentUser.email,
      registrationDate: new Date().toISOString(),
      status: "registered",
      attendance: "pending",
    };

    registeredEvents.push(registration);
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));

    // Update event participants count
    event.participants += 1;
    localStorage.setItem("events", JSON.stringify(events));

    showNotification("Successfully registered for " + event.name, "success");
    updateEventRegistrationButtons();

    // Refresh events display if on events page
    if (window.location.pathname.includes("events.html")) {
      displayEvents();
    }
  }
}

function viewEventDetails(eventId) {
  const event = events.find(function (e) {
    return e.id === eventId;
  });
  if (event) {
    const eventDate = formatDate(event.date);
    const category =
      event.category.charAt(0).toUpperCase() + event.category.slice(1);
    const status = event.status.charAt(0).toUpperCase() + event.status.slice(1);
    const isRegistered = isRegisteredForEvent(event.id);

    const detailsHtml =
      '<div class="modal" id="eventDetailsModal"><div class="modal-content"><span class="close" onclick="closeModal(\'eventDetailsModal\')">&times;</span><h2>' +
      event.name +
      '</h2><div class="event-details"><p><strong>Date:</strong> ' +
      eventDate +
      "</p><p><strong>Time:</strong> " +
      event.time +
      "</p><p><strong>Location:</strong> " +
      event.location +
      "</p><p><strong>Category:</strong> " +
      category +
      "</p><p><strong>Description:</strong> " +
      event.description +
      "</p><p><strong>Participants:</strong> " +
      event.participants +
      '</p><p><strong>Status:</strong> <span class="status ' +
      event.status +
      '">' +
      status +
      '</span></p></div><div class="event-actions"><button onclick="registerForEvent(' +
      event.id +
      "";
  }
}
const response = await axios.post("http://localhost:5000/api/events/register", {
  eventId,
  userId,
});
