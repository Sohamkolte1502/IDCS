# IDCS - College Slip Automation System

A comprehensive frontend-only web application for automating college slip generation with a digital approval chain system. This system eliminates fake teacher signatures by implementing a secure approval workflow.

## 🎯 Features

### Core Functionality
- **Digital Approval Chain**: Subject Teachers → Mini-project → Mentor → Counsellor → HOD
- **Role-based Access Control**: Students, Teachers, HOD, Admin, Office Staff
- **Unified Login System**: Email domain-based role detection
- **Slip Generation**: Only after all required approvals
- **Hall Ticket Distribution**: Office staff interface for ticket issuance

### User Roles & Capabilities

#### 👨‍🎓 Students
- View profile and academic details
- Generate slips only when all approvals are complete
- Track approval status in real-time

#### 👨‍🏫 Faculty (Subject Teachers, Mentors, Counsellors)
- **Subject Teachers**: Approve students for each subject with LMS activity verification
- **Mentors**: Approve after subject and mini-project approvals
- **Counsellors**: Final approval before HOD
- Tab-based interface for different subjects

#### 🎓 HOD (Head of Department)
- Final approval authority
- View complete approval history
- Approve only after all previous approvals are complete

#### 👨‍💼 Admin
- Master data upload and management
- Faculty role assignment
- Student lifecycle management
- Data synchronization controls
- System-wide approval monitoring

#### 🏢 Office Staff
- Search students by Roll No, USN, or Name
- Issue hall tickets for approved students
- Track distribution status

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-slip-automation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔐 Login Credentials

The system uses email domain-based role detection. Here are the test credentials:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@dypatil.edu | admin123 | System administrator |
| **Student** | student1@students.dypatil.edu | student123 | Student user |
| **Teacher** | teacher1@dypatil.edu | teacher123 | Subject teacher & mentor |
| **HOD** | hod@dypatil.edu | hod123 | Head of Department |
| **Office** | office@idcs.dypatil.edu | office123 | Office staff |

## 🌐 Domain → Role Mapping

The system automatically determines user roles based on email domains:

| Domain Pattern | Role | Example |
|----------------|------|---------|
| `@dypatil.edu` or `@students.dypatil.edu` | Student | student@dypatil.edu |
| `*.ac.in` or `@college.ac.in` | Teacher | teacher@college.ac.in |
| `@idcs.dypatil.edu` or `*office*` | Office Staff | office@idcs.dypatil.edu |
| Specific admin emails | Admin/HOD | admin@dypatil.edu |

### Updating Role Mapping

To modify the role detection logic, edit `src/context/AuthContext.jsx`:

```javascript
const getRoleFromEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Add your custom domain rules here
  if (domain === 'yourdomain.com') {
    return 'student';
  }
  
  // ... existing rules
};
```

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
├── components/
│   ├── common/            # Reusable components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Card.jsx
│   │   └── ApprovalBadge.jsx
│   ├── student/           # Student-specific components
│   ├── faculty/           # Faculty-specific components
│   ├── admin/             # Admin-specific components
│   └── office/            # Office-specific components
├── context/
│   └── AuthContext.jsx    # Authentication context
├── data/                  # Mock JSON data
│   ├── users.json
│   ├── students.json
│   ├── faculty.json
│   ├── subjects.json
│   └── approvals.json
├── pages/                 # Main page components
│   ├── Login.jsx
│   ├── StudentDashboard.jsx
│   ├── FacultyDashboard.jsx
│   ├── HODDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── OfficeInterface.jsx
├── styles/                # CSS files
│   ├── global.css
│   ├── login.css
│   ├── student.css
│   ├── faculty.css
│   ├── admin.css
│   ├── office.css
│   └── components.css
├── App.jsx               # Main app component
└── main.jsx              # Entry point
```

## 🎨 Styling

The application uses custom CSS with:
- **Viewport units** (vh/vw) for responsive design
- **CSS variables** for consistent theming
- **No external CSS frameworks** (Tailwind, Bootstrap, etc.)
- **Modern, college-professional design**

### CSS Architecture
- `global.css`: Base styles, variables, typography
- `components.css`: Reusable component styles
- Role-specific CSS files for each dashboard
- Responsive design with mobile-first approach

## 🚀 Vercel Deployment

### Automatic Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Deploy automatically on every push

2. **Manual Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

### Configuration

The project includes `vercel.json` for SPA routing:

```json
{
  "routes": [
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Branch-based Deployment

- **Production**: Deploy from `main` branch
- **Preview**: Deploy from feature branches
- **Automatic**: Every push triggers a deployment

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Components**: Add to appropriate role folder in `src/components/`
2. **New Pages**: Add to `src/pages/` and update routing in `App.jsx`
3. **Styling**: Create role-specific CSS files in `src/styles/`
4. **Data**: Update mock JSON files in `src/data/`

## 📊 Data Management

### Mock Data Structure

The application uses JSON files for mock data:

- **users.json**: User authentication data
- **students.json**: Student profiles and academic info
- **faculty.json**: Faculty members and their roles
- **subjects.json**: Course information
- **approvals.json**: Approval workflow data

### State Management

- **React Context** for authentication
- **Local state** for component data
- **Mock API calls** with setTimeout for realistic UX

## 🔒 Security Features

### Anti-Fraud Measures
- **Sequential Approval Chain**: Each approval depends on previous ones
- **Digital Signatures**: Visual approval badges with timestamps
- **Role-based Access**: Users can only see relevant data
- **Audit Trail**: Complete approval history tracking

### Data Validation
- **Email Domain Validation**: Automatic role detection
- **Approval Prerequisites**: Buttons disabled until criteria met
- **LMS Activity Verification**: Required for subject approvals

## 🐛 Troubleshooting

### Common Issues

1. **Login not working**
   - Check email domain mapping in `AuthContext.jsx`
   - Verify credentials in `src/data/users.json`

2. **Styling issues**
   - Ensure CSS files are imported in components
   - Check viewport units are supported

3. **Build errors**
   - Run `npm install` to ensure dependencies are installed
   - Check for syntax errors in JSX files

### Browser Support

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile responsive** design
- **No Internet Explorer** support

## 📝 License

This project is created for educational purposes. Please ensure compliance with your institution's policies before deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code documentation
3. Create an issue in the repository

---

**Built with ❤️ for educational institutions**
