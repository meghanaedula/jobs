import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  CompanyDrive,
  Application,
  Notice,
  UserRole,
  Branch,
  RoundResult,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_DRIVES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTICES,
} from '../data/seedData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface PlacementContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStudent: Student;
  students: Student[];
  drives: CompanyDrive[];
  applications: Application[];
  notices: Notice[];
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Actions
  applyForDrive: (driveId: string, studentId: string) => { success: boolean; message: string };
  checkEligibility: (student: Student, drive: CompanyDrive) => { isEligible: boolean; reasons: string[] };
  createDrive: (newDrive: Omit<CompanyDrive, 'id' | 'registeredStudentIds' | 'selectedStudentIds'>) => void;
  updateDriveStatus: (driveId: string, status: CompanyDrive['status']) => void;
  updateApplicationRound: (
    applicationId: string,
    roundIndex: number,
    result: RoundResult,
    feedback?: string
  ) => void;
  issueOffer: (applicationId: string, ctc: number) => void;
  acceptOffer: (applicationId: string) => void;
  publishNotice: (notice: Omit<Notice, 'id'>) => void;
  updateStudent: (student: Student) => void;
  resetAllData: () => void;
}

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'nexplacement_role',
  ACTIVE_STUDENT: 'nexplacement_active_student',
  STUDENTS: 'nexplacement_students',
  DRIVES: 'nexplacement_drives',
  APPLICATIONS: 'nexplacement_applications',
  NOTICES: 'nexplacement_notices',
};

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'tpo_admin';
  });

  const [activeStudentId, setActiveStudentIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || 'std_01';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [drives, setDrives] = useState<CompanyDrive[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRIVES);
    return saved ? JSON.parse(saved) : INITIAL_DRIVES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives));
  }, [drives]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast({
      type: 'info',
      title: 'Portal Role Switched',
      message: `You are now interacting as: ${
        newRole === 'tpo_admin'
          ? 'TPO / Head Placement Officer'
          : newRole === 'student'
          ? 'Student Portal'
          : newRole === 'recruiter'
          ? 'Company Recruiter'
          : 'Department Faculty Coordinator'
      }`,
    });
  };

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
    const std = students.find((s) => s.id === id);
    if (std) {
      showToast({
        type: 'info',
        title: 'Active Student Switched',
        message: `Current student perspective: ${std.name} (${std.rollNumber})`,
      });
    }
  };

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // Eligibility evaluation engine
  const checkEligibility = (student: Student, drive: CompanyDrive) => {
    const reasons: string[] = [];
    let isEligible = true;

    // 1. CGPA Cutoff
    if (student.cgpa < drive.eligibility.minCgpa) {
      isEligible = false;
      reasons.push(`CGPA is ${student.cgpa.toFixed(2)}, below required minimum of ${drive.eligibility.minCgpa.toFixed(2)}.`);
    }

    // 2. Active Backlogs
    if (student.activeBacklogs > drive.eligibility.maxBacklogsAllowed) {
      isEligible = false;
      reasons.push(`Candidate has ${student.activeBacklogs} active backlogs (Maximum allowed: ${drive.eligibility.maxBacklogsAllowed}).`);
    }

    // 3. Branch restrictions
    if (!drive.eligibility.eligibleBranches.includes(student.branch)) {
      isEligible = false;
      reasons.push(`Branch '${student.branch}' is not invited for this drive.`);
    }

    // 4. 10th & 12th Cutoffs
    if (student.tenthPercent < drive.eligibility.minTenthPercent) {
      isEligible = false;
      reasons.push(`10th standard percentage is ${student.tenthPercent}%, below required ${drive.eligibility.minTenthPercent}%.`);
    }
    if (student.twelfthPercent < drive.eligibility.minTwelfthPercent) {
      isEligible = false;
      reasons.push(`12th standard percentage is ${student.twelfthPercent}%, below required ${drive.eligibility.minTwelfthPercent}%.`);
    }

    // 5. Multi-Offer policy check (College Placement Directive)
    if (student.status === 'Placed' && student.tier) {
      if (student.tier === 'Super Dream') {
        isEligible = false;
        reasons.push('Placement Policy: You already hold a Super Dream tier offer and cannot apply for additional campus drives.');
      } else if (student.tier === 'Dream' && drive.tier !== 'Super Dream') {
        isEligible = false;
        reasons.push('Placement Policy: Dream tier offer holders may ONLY apply to Super Dream tier drives (>18 LPA).');
      } else if (student.tier === 'Core' && (drive.tier === 'Standard' || drive.tier === 'Core')) {
        isEligible = false;
        reasons.push('Placement Policy: Core tier offer holders can only upgrade to Dream or Super Dream drives.');
      }
    }

    // 6. Verification Status
    if (student.verificationStatus === 'Flagged') {
      isEligible = false;
      reasons.push('Academic records currently flagged by department coordinator for audit.');
    }

    if (isEligible) {
      reasons.push('All academic benchmarks, branch criteria, and placement policy terms met.');
    }

    return { isEligible, reasons };
  };

  const applyForDrive = (driveId: string, studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const drive = drives.find((d) => d.id === driveId);

    if (!student || !drive) {
      return { success: false, message: 'Invalid student or recruitment drive ID.' };
    }

    // Check if already applied
    const existing = applications.find((a) => a.driveId === driveId && a.studentId === studentId);
    if (existing) {
      return { success: false, message: 'Already applied for this drive.' };
    }

    // Check eligibility
    const { isEligible, reasons } = checkEligibility(student, drive);
    if (!isEligible) {
      return { success: false, message: `Ineligible: ${reasons[0]}` };
    }

    // Create application
    const newApp: Application = {
      id: `app_${Date.now()}`,
      driveId,
      studentId,
      appliedAt: new Date().toISOString().split('T')[0],
      currentRoundIndex: 0,
      roundResults: {
        0: 'Pending',
      },
      overallStatus: 'Applied',
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update drive registered students
    setDrives((prev) =>
      prev.map((d) => (d.id === driveId ? { ...d, registeredStudentIds: [...d.registeredStudentIds, studentId] } : d))
    );

    // Update student status if unplaced
    if (student.status === 'Unplaced') {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: 'In Process' } : s))
      );
    }

    showToast({
      type: 'success',
      title: 'Application Submitted!',
      message: `Successfully registered for ${drive.companyName} (${drive.roleTitle}).`,
    });

    return { success: true, message: 'Application submitted successfully!' };
  };

  const createDrive = (newDriveData: Omit<CompanyDrive, 'id' | 'registeredStudentIds' | 'selectedStudentIds'>) => {
    const id = `drv_${Date.now()}`;
    const newDrive: CompanyDrive = {
      ...newDriveData,
      id,
      registeredStudentIds: [],
      selectedStudentIds: [],
    };
    setDrives((prev) => [newDrive, ...prev]);
    showToast({
      type: 'success',
      title: 'New Drive Published',
      message: `Drive for ${newDrive.companyName} (${newDrive.roleTitle}) created and visible to students.`,
    });
  };

  const updateDriveStatus = (driveId: string, status: CompanyDrive['status']) => {
    setDrives((prev) => prev.map((d) => (d.id === driveId ? { ...d, status } : d)));
    showToast({
      type: 'info',
      title: 'Drive Status Updated',
      message: `Recruitment drive status marked as '${status}'.`,
    });
  };

  const updateApplicationRound = (
    applicationId: string,
    roundIndex: number,
    result: RoundResult,
    feedback?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const updatedResults = { ...app.roundResults, [roundIndex]: result };
        const drive = drives.find((d) => d.id === app.driveId);
        const totalRounds = drive?.rounds.length || 3;

        let newCurrentRound = app.currentRoundIndex;
        let newOverallStatus = app.overallStatus;

        if (result === 'Cleared') {
          if (roundIndex + 1 < totalRounds) {
            newCurrentRound = roundIndex + 1;
            updatedResults[newCurrentRound] = 'Pending';
            newOverallStatus = 'In Interview Rounds';
          } else {
            // Cleared all rounds!
            newOverallStatus = 'Offered';
          }
        } else if (result === 'Rejected') {
          newOverallStatus = 'Rejected';
        }

        return {
          ...app,
          currentRoundIndex: newCurrentRound,
          roundResults: updatedResults,
          overallStatus: newOverallStatus,
          interviewerNotes: feedback || app.interviewerNotes,
        };
      })
    );

    showToast({
      type: 'info',
      title: 'Candidate Round Updated',
      message: `Round ${roundIndex + 1} marked as '${result}'.`,
    });
  };

  const issueOffer = (applicationId: string, ctc: number) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const drive = drives.find((d) => d.id === app.driveId);
    const student = students.find((s) => s.id === app.studentId);

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, overallStatus: 'Offered', offeredCtc: ctc } : a))
    );

    showToast({
      type: 'success',
      title: 'Official Offer Issued!',
      message: `Offer of ${ctc} LPA from ${drive?.companyName} rolled out to ${student?.name}.`,
    });
  };

  const acceptOffer = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const drive = drives.find((d) => d.id === app.driveId);
    if (!drive) return;

    // Update application
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, overallStatus: 'Offer Accepted' } : a))
    );

    // Update student
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== app.studentId) return s;
        return {
          ...s,
          status: 'Placed',
          placedCompany: drive.companyName,
          placedPackageLpa: app.offeredCtc || drive.ctc,
          placedRole: drive.roleTitle,
          tier: drive.tier,
        };
      })
    );

    // Update drive selected students
    setDrives((prev) =>
      prev.map((d) =>
        d.id === drive.id
          ? {
              ...d,
              selectedStudentIds: Array.from(new Set([...d.selectedStudentIds, app.studentId])),
            }
          : d
      )
    );

    showToast({
      type: 'success',
      title: 'Offer Accepted & Placed! 🎉',
      message: `Congratulations! Offer from ${drive.companyName} at ${app.offeredCtc || drive.ctc} LPA accepted.`,
    });
  };

  const publishNotice = (noticeData: Omit<Notice, 'id'>) => {
    const id = `not_${Date.now()}`;
    const newNotice: Notice = { ...noticeData, id };
    setNotices((prev) => [newNotice, ...prev]);
    showToast({
      type: 'success',
      title: 'Notice Published',
      message: `Official circular ${newNotice.circularNumber} broadcasted to students.`,
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast({
      type: 'success',
      title: 'Student Profile Updated',
      message: `Records for ${updatedStudent.name} (${updatedStudent.rollNumber}) updated.`,
    });
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.DRIVES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    setStudents(INITIAL_STUDENTS);
    setDrives(INITIAL_DRIVES);
    setApplications(INITIAL_APPLICATIONS);
    setNotices(INITIAL_NOTICES);
    showToast({
      type: 'info',
      title: 'System Reset',
      message: 'Restored realistic seed records for all placement modules.',
    });
  };

  return (
    <PlacementContext.Provider
      value={{
        role,
        setRole,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        students,
        drives,
        applications,
        notices,
        toasts,
        showToast,
        dismissToast,
        applyForDrive,
        checkEligibility,
        createDrive,
        updateDriveStatus,
        updateApplicationRound,
        issueOffer,
        acceptOffer,
        publishNotice,
        updateStudent,
        resetAllData,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = () => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
