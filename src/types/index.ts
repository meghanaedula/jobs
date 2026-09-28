export type UserRole = 'tpo_admin' | 'student' | 'recruiter' | 'faculty';

export type Branch =
  | 'Computer Science & Engineering'
  | 'Information Technology'
  | 'Electronics & Communication'
  | 'Electrical & Electronics'
  | 'Mechanical Engineering'
  | 'Civil Engineering';

export type PackageTier = 'Super Dream' | 'Dream' | 'Core' | 'Standard';

export type PlacementStatus = 'Unplaced' | 'In Process' | 'Placed';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  branch: Branch;
  batch: string;
  cgpa: number;
  activeBacklogs: number;
  historyOfBacklogs: number;
  tenthPercent: number;
  twelfthPercent: number;
  skills: string[];
  resumeUrl?: string;
  resumeSummary?: string;
  status: PlacementStatus;
  placedCompany?: string;
  placedPackageLpa?: number;
  placedRole?: string;
  tier?: PackageTier;
  avatar: string;
  verificationStatus: 'Verified' | 'Pending Review' | 'Flagged';
  notes?: string;
}

export type DriveRoundStatus = 'Upcoming' | 'Active' | 'Completed';

export interface DriveRound {
  id: number;
  name: string;
  type: 'Aptitude / Online Assessment' | 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'HR & Cultural Fit';
  date: string;
  time?: string;
  venue: string;
  status: DriveRoundStatus;
  shortlistedCount?: number;
}

export interface CompanyDrive {
  id: string;
  companyName: string;
  logo: string;
  website: string;
  industry: string;
  roleTitle: string;
  ctc: number; // in LPA
  stipend?: string; // e.g. "₹75,000 / month"
  tier: PackageTier;
  location: string;
  jobDescription: string;
  eligibility: {
    minCgpa: number;
    maxBacklogsAllowed: number;
    eligibleBranches: Branch[];
    minTenthPercent: number;
    minTwelfthPercent: number;
  };
  rounds: DriveRound[];
  applicationDeadline: string;
  driveDate: string;
  status: 'Applications Open' | 'Ongoing Drive' | 'Completed' | 'Upcoming';
  registeredStudentIds: string[];
  selectedStudentIds: string[];
  bondDuration?: string;
  vacancies: number;
}

export type RoundResult = 'Pending' | 'Cleared' | 'Rejected' | 'Shortlisted' | 'Absent';

export interface Application {
  id: string;
  driveId: string;
  studentId: string;
  appliedAt: string;
  currentRoundIndex: number;
  roundResults: Record<number, RoundResult>;
  overallStatus: 'Applied' | 'Under Screening' | 'In Interview Rounds' | 'Offered' | 'Offer Accepted' | 'Rejected';
  interviewerRating?: number; // 1 to 5
  interviewerNotes?: string;
  offeredCtc?: number;
}

export interface Notice {
  id: string;
  title: string;
  circularNumber: string;
  category: 'Drive Announcement' | 'Interview Schedule' | 'Offer Letter Release' | 'Policy Update' | 'Training & Preparation';
  author: string;
  authorRole: string;
  date: string;
  urgency: 'Critical' | 'High' | 'Normal';
  targetBranches: ('All' | Branch)[];
  content: string;
  actionRequired?: string;
  driveId?: string;
}

export interface PracticeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Data Structures & Algorithms' | 'DBMS & SQL' | 'Core CS';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AtsAnalysisResult {
  atsScore: number;
  verdict: 'Strong Match' | 'Competitive Match' | 'Needs Improvement' | 'Underqualified';
  matchedSkills: string[];
  missingSkills: string[];
  keyStrengths: string[];
  criticalGaps: string[];
  actionableRecommendations: string[];
  tailoredSummary: string;
}

export interface InterviewKitResult {
  roundFocus: string;
  questions: {
    id: number;
    question: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    expectedAnswerOutline: string;
    interviewerRubric: string;
  }[];
  topAdviceForSuccess: string[];
}

export interface JobFitResult {
  isEligible: boolean;
  eligibilityBreakdown: string;
  readinessScore: number;
  competitiveAdvantage: string[];
  preparationChecklist: string[];
  recommendedAction: string;
}
