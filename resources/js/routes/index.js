import { DashboardPage } from "../pages/admin/dashboard";
import { CollegePage } from "../pages/admin/college";
import { CollegeDetails } from "../pages/admin/college";
import { StudentPage } from "../pages/admin/students";
import { FacultyPage } from "../pages/admin/faculties";
import { EmployeePage } from "../pages/admin/employees";
import { DepartmentPage } from "../pages/admin/departments";
import { ThesisPageAdmin } from "../pages/admin/thesis";
import { ThesisDetails } from "../pages/admin/thesis";
import { ThesisDetails as ThesisDocDetails } from "~/components";
import { AutoSchedule } from "../pages/admin/schedule";
import { GroupsPageAdmin } from "../pages/admin/groups";
import { SYPage } from "../pages/admin/schoolyear";
import { SchedReportPage } from "../pages/admin/reports/schedule";

import { FacultyDashboardPage } from "../pages/faculty/dashboard";
import { ThesisPage } from "../pages/faculty/thesis";
import { GroupsPage } from "../pages/faculty/groups";

import { ThesisPageStudent } from "../pages/student/thesis";
import { StudentDashboard } from "../pages/student/dashboard";

import Pages404  from "../pages/ErrorPages/Pages404";
import { LoginPage } from "../pages/auth";
import { MainPage } from "../pages/Main";
import { DocumentPage } from "../pages/shared";
import {ProfilePage } from "../pages/shared/profile";



const authRoutes = [{ path: "/login", component: LoginPage }];

const adminRoutes = [
    { path: "/admin/dashboard", title:'Dashboard', component: DashboardPage },
    { path: "/admin/schoolyear", component: SYPage },
    { path: "/admin/college", component: CollegePage },
     { path: "/admin/departments", component: DepartmentPage },
    { path: "/admin/college/details", component: CollegeDetails },
    { path: "/admin/students", component: StudentPage },
    { path: "/admin/faculties", component: FacultyPage },
    { path: "/admin/employees", component: EmployeePage },
    { path: "/admin/thesis/details", component: ThesisDetails },
    { path: "/admin/schedules", component: AutoSchedule },
    { path: "/admin/groups", component: GroupsPageAdmin },
    { path: "/admin/thesis", component: ThesisPageAdmin },
    { path: "/admin/thesis-details", component: ThesisPageStudent },
    { path: "/admin/thesis-doc-details", component: ThesisDocDetails },
    { path: "/admin/document", component: DocumentPage },
    { path: "/admin/reports/schedules", component: SchedReportPage },
    // { path: "/schedule-details-pdf"},
];

const facultyRoutes = [
    { path: "/faculty/dashboard", component: FacultyDashboardPage },
    { path: "/faculty/thesis", component: ThesisPageAdmin },
    //{ path: "/faculty/groups", component: GroupsPage },
    { path: "/faculty/groups", component: GroupsPageAdmin },
    { path: "/faculty/thesis-details", component: ThesisPageStudent },
];

const studentRoutes = [
    { path: "/student/dashboard", component: StudentDashboard },
    { path: "/student/thesis", component: ThesisPageStudent },
    { path: "/student/profile", component: ProfilePage },
];


const noLayoutRoutes = [
    { path: "/404", component: Pages404 },
    { path: "/", component: MainPage },
];



export { noLayoutRoutes, authRoutes, adminRoutes, facultyRoutes, studentRoutes };
