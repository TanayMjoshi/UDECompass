import { BuildingPageData } from '../types/Building';

export const buildingPagesData: Record<string, BuildingPageData> = {
  'library': {
    id: 'library',
    title: 'Central Library',
    description: 'Your gateway to academic excellence and research resources at the University of Duisburg-Essen.',
    content: `
      <h2>Welcome to the Central Library</h2>
      <p class="lead">The Central Library serves as the academic heart of UDE, providing comprehensive resources and services to support your studies and research endeavors.</p>
      
      <h3>📚 Library Hours</h3>
      <div class="hours-grid">
        <ul>
          <li><strong>Monday - Friday:</strong> 8:00 AM - 10:00 PM</li>
          <li><strong>Saturday:</strong> 9:00 AM - 8:00 PM</li>
          <li><strong>Sunday:</strong> 10:00 AM - 6:00 PM</li>
        </ul>
      </div>
      
      <h3>📖 Special Collections</h3>
      <p>Access rare books, manuscripts, and specialized research materials in our special collections department. Our curated collections include historical documents, academic archives, and unique research materials.</p>
      
      <h3>💻 Digital Resources</h3>
      <p>Explore our extensive digital library with thousands of e-books, academic journals, and research databases available 24/7 from anywhere on campus or at home.</p>
    `,
    links: [
      {
        title: 'Library Catalog',
        url: 'https://www.uni-due.de/ub/en/atoz/access-from-home.php',
        description: 'Access library resources from home and search the catalog'
      },
      {
        title: 'Digital Library',
        url: 'https://primo.uni-due.de/discovery/search?vid=49HBZ_UDE:UDE&lang=en',
        description: 'Search and access digital resources, e-books, and databases'
      },
      {
        title: 'Study Room Booking',
        url: 'https://www.uni-due.de/ub/lernenundarbeiten.php',
        description: 'Reserve individual and group study spaces'
      }
    ],
    backgroundColor: '#8B4513',
    textColor: '#FFFFFF'
  },
  'student-center': {
    id: 'student-center',
    title: 'Student Center',
    description: 'The hub of student life, organizations, support services, and community discussions at UDE.',
    content: `
      <h2>Student Life at UDE</h2>
      <p class="lead">The Student Center is your go-to place for getting involved in campus life, finding support, connecting with fellow students, and participating in community discussions.</p>
      
      <h3>💬 Student Forum</h3>
      <p>Join our vibrant student community forum where you can ask questions, share experiences, and help fellow students. Discuss everything from academic topics to campus life, visa services, and local recommendations. Our forum is organized by categories to help you find exactly what you're looking for.</p>
      
      <h3>🎯 Student Organizations</h3>
      <p>Join over 100 student organizations covering academics, sports, culture, and special interests. From academic societies to cultural clubs, there's something for everyone.</p>
      
      <h3>🤝 Support Services</h3>
      <p>Get help with academic planning, career guidance, and personal counseling services. Our dedicated staff is here to support your success throughout your university journey.</p>
      
      <h3>🎉 Events & Activities</h3>
      <p>Participate in regular events, workshops, and social activities that bring the campus community together. Check our calendar for upcoming events and opportunities to get involved.</p>
      
      <h3>📍 Facilities</h3>
      <p>Modern meeting rooms, event spaces, and collaborative areas designed to foster student engagement and community building.</p>
    `,
    links: [
      {
        title: 'HISiOne Student Portal',
        url: 'https://campus.uni-due.de/cm/pages/cs/sys/portal/hisinoneStartPage.faces',
        description: 'Access your student information system for enrollment, grades, and academic records'
      },
      {
        title: 'LSF Course Catalog',
        url: 'https://campus.uni-due.de/lsf/rds?state=user&type=0',
        description: 'Browse course offerings, schedules, and register for classes'
      },
      {
        title: 'Moodle Learning Platform',
        url: 'https://lehre.moodle.uni-due.de',
        description: 'Access course materials, assignments, and communicate with instructors'
      },
      {
        title: 'Study Drive',
        url: 'https://www.studydrive.net',
        description: 'Share study materials, notes, and connect with fellow students'
      },
      {
        title: 'Student Services Overview',
        url: 'https://www.uni-due.de/en/student_services.php',
        description: 'Complete overview of all student services at UDE'
      },
      {
        title: 'Student Organizations',
        url: 'https://www.uni-due.de/en/organisation.php',
        description: 'Explore clubs, societies, and student organizations to join'
      },
      {
        title: 'Career Services',
        url: 'https://www.uni-due.de/career/',
        description: 'Career counseling, job placement, and professional development'
      },
      {
        title: 'Counseling Services',
        url: 'https://www.uni-due.de/en/studying/counselling.php',
        description: 'Personal, academic, and psychological support services'
      }
    ],
    backgroundColor: '#BE185D',
    textColor: '#FFFFFF',
    showForum: true
  },
  'cafeteria': {
    id: 'cafeteria',
    title: 'Cafeteria/Mensa',
    description: 'Delicious, affordable meals and a vibrant dining atmosphere for the UDE community.',
    content: `
      <h2>Dining at UDE</h2>
      <p class="lead">Our cafeteria offers a wide variety of fresh, healthy, and affordable meals to fuel your academic journey.</p>
      
      <h3>🍽️ Dining Options</h3>
      <p>Multiple restaurants and cafeterias across campus offering diverse cuisines including German, international, and fusion dishes. From quick snacks to full meals, we have options for every appetite and schedule.</p>
      
      <h3>🌱 Special Diets</h3>
      <p>We cater to vegetarian, vegan, halal, and other dietary requirements with clearly marked options. Our nutritional information is available for all dishes to help you make informed choices.</p>
      
      <h3>☕ Coffee & Snacks</h3>
      <p>Multiple coffee shops and snack bars throughout campus for your caffeine fix and quick bites between classes.</p>
      
      <h3>💰 Student-Friendly Prices</h3>
      <p>Affordable pricing designed with students in mind. Meal plans and student discounts available to help you save money while eating well.</p>
    `,
    links: [
      {
        title: 'Catering Services',
        url: 'https://www.stw-edu.de/en/catering',
        description: 'Overview of all dining services and locations'
      },
      {
        title: 'Weekly Menu',
        url: 'https://www.stw-edu.de/en/catering/menus',
        description: 'Current meal offerings, prices, and dining locations'
      }
    ],
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF'
  },
  'visa-services': {
    id: 'visa-services',
    title: 'Visa Services',
    description: 'Comprehensive immigration and visa support for international students at UDE.',
    content: `
      <h2>International Student Support</h2>
      <p class="lead">Our visa services team provides comprehensive support for all immigration-related matters for international students.</p>
      
      <h3>📋 Services Offered</h3>
      <ul>
        <li><strong>Visa Applications:</strong> Complete assistance with student visa applications and renewals</li>
        <li><strong>Residence Permits:</strong> Help with residence permit applications and extensions</li>
        <li><strong>Document Verification:</strong> Official verification and translation services</li>
        <li><strong>Immigration Consultation:</strong> Expert advice on German immigration law and procedures</li>
        <li><strong>Work Permits:</strong> Guidance on student work authorization and permits</li>
      </ul>
      
      <h3>🕒 Office Hours</h3>
      <p><strong>Monday - Friday:</strong> 9:00 AM - 4:00 PM<br>
      <em>Appointments recommended for personalized consultation</em></p>
      
      <h3>📞 Emergency Support</h3>
      <p>Urgent immigration matters can be addressed through our emergency contact system. We understand the importance of maintaining legal status and are here to help.</p>
    `,
    links: [
      {
        title: 'Visa Requirements',
        url: 'https://www.uni-due.de/welcome-centre/en/visa_en.php',
        description: 'Check visa requirements and application procedures'
      },
      {
        title: 'Document Checklist',
        url: 'https://www.uni-due.de/welcome-centre/en/vde_check.php',
        description: 'Required documents for visa and residence permit applications'
      },
      {
        title: 'Book Appointment',
        url: 'https://www.uni-due.de/international/abh_en',
        description: 'Schedule a consultation with our immigration specialists'
      }
    ],
    backgroundColor: '#7C2D12',
    textColor: '#FFFFFF'
  },
  'administration': {
    id: 'administration',
    title: 'Administration Building',
    description: 'Central hub for student registration, academic records, and administrative services.',
    content: `
      <h2>Administrative Services</h2>
      <p class="lead">The Administration Building houses all central administrative functions to support your academic journey at UDE.</p>
      
      <h3>🏢 Key Departments</h3>
      <ul>
        <li><strong>Student Registration Office:</strong> Enrollment, re-registration, and student status changes</li>
        <li><strong>Academic Records:</strong> Transcripts, certificates, and academic documentation</li>
        <li><strong>Financial Aid Office:</strong> Scholarships, grants, and financial assistance programs</li>
        <li><strong>International Student Office:</strong> Support for international students and exchange programs</li>
        <li><strong>Examination Office:</strong> Exam registration, results, and academic appeals</li>
      </ul>
      
      <h3>🕒 Service Hours</h3>
      <p><strong>Monday - Thursday:</strong> 8:00 AM - 4:00 PM<br>
      <strong>Friday:</strong> 8:00 AM - 2:00 PM</p>
      
      <h3>📱 Online Services</h3>
      <p>Many administrative tasks can be completed online through our student portal, including course registration, grade viewing, and document requests.</p>
    `,
    links: [
      {
        title: 'Student Portals',
        url: 'https://www.uni-due.de/en/current.php',
        description: 'Access current student information and university portals'
      },
      {
        title: 'Applications',
        url: 'https://www.uni-due.de/en/studying/application.php',
        description: 'Application forms and procedures for various programs'
      },
      {
        title: 'Financial Aid',
        url: 'https://www.uni-due.de/en/studying/funding.php',
        description: 'Information about scholarships, grants, and financial support'
      },
      {
        title: 'Uni-DUE Student Job Board (Werkstudentenstellen)',
        url: 'https://www.uni-due.de/stellenmarkt/werkstudenten.shtml',
        description: 'Find part-time job opportunities for students at UDE'
      }
    ],
    backgroundColor: '#059669',
    textColor: '#FFFFFF'
  },
  'ude-portals': {
    id: 'ude-portals',
    title: 'UDE Portals and Important Links',
    description: 'Your digital gateway to all UDE online services, platforms, and essential resources.',
    content: `
      <h2>Digital Services at UDE</h2>
      <p class="lead">Access all essential digital platforms and online services through our centralized portal system.</p>
      
      <h3>🖥️ Key Platforms</h3>
      <ul>
        <li><strong>Studierendenwerk Services:</strong> Housing, dining, and student welfare services</li>
        <li><strong>Moodle LMS:</strong> Learning management system for courses and materials</li>
        <li><strong>Email & Communication:</strong> University email and communication tools</li>
        <li><strong>IT Support:</strong> Technical help center and IT services</li>
        <li><strong>Campus Maps:</strong> Interactive maps and navigation tools</li>
      </ul>
      
      <h3>🔧 Technical Support</h3>
      <p>Get help with login issues, password resets, and technical problems through our IT support center. Our technical team provides comprehensive support for all digital services.</p>
      
      <h3>🗺️ Campus Navigation</h3>
      <p>Access detailed maps of both Duisburg and Essen campuses to help you navigate the university grounds and find specific buildings and facilities. Interactive maps include building information, accessibility features, and real-time updates.</p>
      
      <h3>📱 Mobile Access</h3>
      <p>Most services are optimized for mobile devices, allowing you to access important information and complete tasks on the go.</p>
      
      <h3>💬 Student Communication</h3>
      <p>Connect with fellow students through our official communication channels and stay updated with the latest campus news and announcements.</p>
    `,
    links: [
      {
        title: 'Studierendenwerk',
        url: 'https://www.stw-edu.de/en/',
        description: 'Student services including housing, dining, and financial aid'
      },
      {
        title: 'Moodle LMS',
        url: 'https://www.uni-due.de/zim/services/moodle/index_eng.php',
        description: 'Learning management system for courses and materials'
      },
      {
        title: 'UDE Webmail',
        url: 'https://www.uni-due.de/zim/services/e-mail/webmail_login.php',
        description: 'Access your university email account'
      },
      {
        title: 'IT Support',
        url: 'https://www.uni-due.de/zim/hilfecenter/',
        description: 'Technical help center and IT support services'
      },
      {
        title: 'University Addresses & Maps',
        url: 'https://www.uni-due.de/en/university_addresses.shtml',
        description: 'Complete overview of all university locations and addresses'
      },
      {
        title: 'Join WhatsApp Group',
        url: 'https://chat.whatsapp.com/D5VuHyVefy2AjdDMShaxUr',
        description: 'Connect with fellow UDE students on WhatsApp'
      },
      {
        title: 'Join Discord Server',
        url: 'https://discord.gg/KGBeRefR',
        description: 'Join our Discord community for real-time chat and study groups'
      }
    ],
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF',
    maps: [
      {
        title: 'Campus Duisburg',
        url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_standorte_duisburg_e_2020.jpg',
        description: 'Overview map of Duisburg campus locations',
        submaps: [
          {
            title: 'Duisburg: M-, L- & S-area',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_duisburg_m_l_e_2020.jpg',
            description: 'Detailed map of M-, L- and S-area buildings'
          },
          {
            title: 'Duisburg: B- & SK-area',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_duisburg_b_e_2020.jpg',
            description: 'Detailed map of B- and SK-area buildings'
          },
          {
            title: 'Duisburg: ST-area',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_duisburg_st_e_2020.jpg',
            description: 'Detailed map of ST-area buildings'
          }
        ]
      },
      {
        title: 'Campus Essen',
        url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_standorte_essen_e_2020.jpg',
        description: 'Overview map of Essen campus locations',
        submaps: [
          {
            title: 'Campus Essen',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_essen_campus_e_2020.jpg',
            description: 'Detailed map of main Essen campus'
          },
          {
            title: 'Schützenbahn & Gerlingstraße Essen',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_essen_schuetzenbahn_e_2020.jpg',
            description: 'Map of Schützenbahn and Gerlingstraße area'
          },
          {
            title: 'WSC & WST Essen',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_essen_weststadt_e_2020.jpg',
            description: 'Map of WSC and WST Weststadt area'
          },
          {
            title: 'University Clinic Essen',
            url: 'https://www.uni-due.de/imperia/md/content/dokumente/lageplaene/map_essen_klinikum_l_e_2020.jpg',
            description: 'Map of University Hospital and medical facilities'
          }
        ]
      }
    ]
  }
};