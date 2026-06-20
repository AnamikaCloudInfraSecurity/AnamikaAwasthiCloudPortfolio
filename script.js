document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Theme Toggle Logic
     ========================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });


  /* ==========================================
     2. Mobile Menu Navigation
     ========================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  /* ==========================================
     3. Active Section Observer (Navbar highlighting)
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navObserverOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: "-80px 0px 0px 0px" // Adjusted for header height
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });


  /* ==========================================
     4. Skills Filter Logic
     ========================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const competencyCards = document.querySelectorAll('.competency-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab styling
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      competencyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ==========================================
     5. Project Tabs Interactivity
     ========================================== */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const tabButtons = card.querySelectorAll('.project-tab-btn');
    const panes = card.querySelectorAll('.project-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes in this card
        tabButtons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        // Activate selected
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        card.querySelector(`#${targetId}`).classList.add('active');
      });
    });
  });


  /* ==========================================
     6. Cloud Terminal Simulator Logic
     ========================================== */
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInputDisplay = document.getElementById('terminal-input-display');
  const terminalCmdTags = document.querySelectorAll('.terminal-cmd-tag');
  
  const commands = {
    help: `Available commands:
  - skills          Display technical expertise stack
  - certifications  Show active professional credentials
  - experience      List corporate work timeline details
  - clear           Flush terminal history logs`,
    
    skills: `=====================================================
TECHNICAL STACK SUMMARY:
=====================================================
• Cloud Platforms: AWS, Microsoft Azure, Nutanix HCI
• Security Core: Zero Trust API, IAM Policies, Security Hardening
• IaC & Pipeline: Terraform (HCL), GitHub Actions CI/CD
• Systems Support: PowerShell Automation, Python Scripting, L2/L3 Windows Support`,
    
    certifications: `=====================================================
PROFESSIONAL CREDENTIALS:
=====================================================
• AZ-104: Microsoft Azure Administrator Associate
• NCA: Nutanix Certified Associate (6.5)
• CC: ISC2 Certified in Cybersecurity
• AWS: AWS Certified Cloud Practitioner
• AZ-900: Microsoft Azure Fundamentals`,
    
    experience: `=====================================================
WORK TIMELINE SUMMARY:
=====================================================
• Technical Service Specialist | KYNDRYL India Pvt Ltd
  Oct 2021 - Present
  - Discovery Lead on 4+ enterprise cloud migrations.
  - Reduced audit manual time by 40% using PowerShell framework.
  
• IT Support & Infrastructure Associate | IBM
  Jul 2021 - Sep 2021
  - Global Windows Server L2/L3 infrastructure operations.`
  };

  let typing = false;
  let initialRun = true;

  async function typeText(element, text, delay = 15) {
    return new Promise((resolve) => {
      let index = 0;
      element.innerHTML = '';
      const interval = setInterval(() => {
        if (index < text.length) {
          // Keep linebreaks intact
          if (text[index] === '\n') {
            element.innerHTML += '<br>';
          } else {
            element.innerHTML += text[index];
          }
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }

  async function runCommand(cmdText) {
    if (typing) return;
    typing = true;

    // Clear history on subsequent runs (or if clear is called) to prevent scrolling
    if (!initialRun || cmdText === 'clear') {
      terminalHistory.innerHTML = '';
      const welcomeMsg = document.querySelector('.terminal-welcome');
      if (welcomeMsg) {
        welcomeMsg.style.display = 'none';
      }
    }
    initialRun = false;

    // Simulate input typing first
    await typeText(terminalInputDisplay, cmdText, 50);
    
    setTimeout(async () => {
      // Reset input display line
      terminalInputDisplay.innerHTML = '';

      // Print Command and Echo prompt in history
      const promptLine = document.createElement('div');
      promptLine.className = 'terminal-line';
      promptLine.innerHTML = `<span class="terminal-prompt">anamika@cloud-shell:~$</span> <span style="color: var(--text-primary);">${cmdText}</span>`;
      terminalHistory.appendChild(promptLine);

      // Print output
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-output';
      
      if (cmdText === 'clear') {
        terminalHistory.innerHTML = '';
        typing = false;
        return;
      }

      const outputContent = commands[cmdText] || `Command not found: ${cmdText}. Type 'help' for available commands.`;
      terminalHistory.appendChild(outputLine);
      
      await typeText(outputLine, outputContent, 5);

      // Scroll to bottom of terminal
      const terminalBody = document.getElementById('terminal-body');
      terminalBody.scrollTop = terminalBody.scrollHeight;
      
      typing = false;
    }, 300);
  }

  // Click tags handlers
  terminalCmdTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const command = tag.getAttribute('data-cmd');
      runCommand(command);
    });
  });

  // Initial welcome command run
  setTimeout(() => {
    runCommand('help');
  }, 1000);


  /* ==========================================
     7. Contact Form Handling (Mock Validation)
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const messageVal = document.getElementById('message').value.trim();

    if (!nameVal || !emailVal || !messageVal) {
      formStatus.textContent = 'All fields are required.';
      formStatus.className = 'form-status error';
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.className = 'form-status error';
      return;
    }

    // Success Simulation
    formStatus.textContent = 'Thank you! Your message was sent successfully.';
    formStatus.className = 'form-status success';
    
    // Clear form fields
    contactForm.reset();

    // Fade out status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
      }, 500);
    }, 5000);
  });

  /* ==========================================
     8. Scroll Reveal Animations (Intersection Observer)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================
     9. Zero Trust Access Authorization for Resume Download
     ========================================== */
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const securityModal = document.getElementById('security-modal');
  const securityConsole = document.getElementById('security-console');
  const securityProgressFill = document.getElementById('security-progress-fill');

  if (downloadCvBtn && securityModal && securityConsole) {
    const logs = [
      { text: '> Initializing Zero Trust Handshake Request...', type: 'info', progress: 15 },
      { text: '> WARNING: Access restricted. Token required.', type: 'warn', progress: 30 },
      { text: '> Negotiating secure session credentials...', type: 'info', progress: 50 },
      { text: '> Verifying user cryptographic signature (SigV4)...', type: 'info', progress: 70 },
      { text: '> Verification: APPROVED. Access token generated.', type: 'success', progress: 85 },
      { text: '> Decrypting payload: Anamika_Awasthi_Cloud_20_April.docx...', type: 'success', progress: 100 }
    ];

    async function printLogLine(log, delay) {
      return new Promise(resolve => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.className = log.type;
          line.textContent = log.text;
          securityConsole.appendChild(line);
          securityConsole.scrollTop = securityConsole.scrollHeight;
          securityProgressFill.style.width = `${log.progress}%`;
          resolve();
        }, delay);
      });
    }

    downloadCvBtn.addEventListener('click', async () => {
      // Clear console
      securityConsole.innerHTML = '';
      securityProgressFill.style.width = '0%';
      
      // Show modal
      securityModal.classList.add('active');

      // Print logs step by step
      for (let i = 0; i < logs.length; i++) {
        await printLogLine(logs[i], i === 0 ? 300 : 700);
      }

      // Trigger download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'Anamika_Awasthi_Cloud_20_April.docx'; // Target filename in workspace
        link.download = 'Anamika_Awasthi_CV.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Hide modal
        setTimeout(() => {
          securityModal.classList.remove('active');
        }, 1500);
      }, 1000);
    });

    // Close modal when clicking outside contents
    securityModal.addEventListener('click', (e) => {
      if (e.target === securityModal) {
        securityModal.classList.remove('active');
      }
    });
  }

});
