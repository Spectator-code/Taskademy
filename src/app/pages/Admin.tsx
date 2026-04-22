import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, ListChecks, Flag, BarChart3, TrendingUp, TrendingDown, Check, X, AlertTriangle, Eye } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../contexts/TaskContext";
import { toast } from "sonner";

const userDataByRange = {
  daily: [
    { id: "d1", label: "Mon", users: 12 },
    { id: "d2", label: "Tue", users: 18 },
    { id: "d3", label: "Wed", users: 15 },
    { id: "d4", label: "Thu", users: 22 },
    { id: "d5", label: "Fri", users: 28 },
    { id: "d6", label: "Sat", users: 8 },
    { id: "d7", label: "Sun", users: 5 }
  ],
  weekly: [
    { id: "w1", label: "Week 1", users: 34 },
    { id: "w2", label: "Week 2", users: 56 },
    { id: "w3", label: "Week 3", users: 78 },
    { id: "w4", label: "Week 4", users: 92 }
  ],
  monthly: [
    { id: "m1", label: "Jan", users: 45 },
    { id: "m2", label: "Feb", users: 78 },
    { id: "m3", label: "Mar", users: 120 },
    { id: "m4", label: "Apr", users: 156 }
  ],
  yearly: [
    { id: "y1", label: "2023", users: 234 },
    { id: "y2", label: "2024", users: 567 },
    { id: "y3", label: "2025", users: 892 },
    { id: "y4", label: "2026", users: 1245 }
  ]
};

const taskData = [
  { id: "t1", month: "Jan", tasks: 23 },
  { id: "t2", month: "Feb", tasks: 45 },
  { id: "t3", month: "Mar", tasks: 67 },
  { id: "t4", month: "Apr", tasks: 89 }
];


const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", joined: "2 days ago", status: "Active" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", joined: "5 days ago", status: "Active" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", joined: "1 week ago", status: "Pending" }
];

const recentTasks = [
  { id: 1, title: "Design Landing Page", client: "Sarah Chen", status: "In Progress" },
  { id: 2, title: "Write Blog Post", client: "Emma Davis", status: "Completed" },
  { id: 3, title: "Build Component Library", client: "Michael Brown", status: "Under Review" }
];

const platformReports = [
  {
    id: 1,
    type: "Inappropriate Content",
    reportedBy: "Jane Smith",
    reportedUser: "Tom Wilson",
    reason: "Task description contains offensive language",
    taskTitle: "Website Redesign Project",
    status: "Pending",
    date: "1 hour ago",
    severity: "high"
  },
  {
    id: 2,
    type: "Payment Dispute",
    reportedBy: "Michael Brown",
    reportedUser: "Sarah Johnson",
    reason: "Client refused to pay after task completion",
    taskTitle: "Logo Design",
    status: "Pending",
    date: "3 hours ago",
    severity: "medium"
  },
  {
    id: 3,
    type: "Spam/Scam",
    reportedBy: "Emma Davis",
    reportedUser: "John Fake",
    reason: "User posting fake tasks to collect personal information",
    taskTitle: "Data Entry Work",
    status: "Pending",
    date: "5 hours ago",
    severity: "high"
  }
];

export default function Admin() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [reports, setReports] = useState(platformReports);
  const { pendingTasks, approveTask, rejectTask } = useTasks();

  const userData = userDataByRange[timeRange];
  const maxUsers = Math.max(...userData.map(d => d.users));

  const handleApprove = (taskId: number) => {
    approveTask(taskId);
    toast.success("Task approved and published!");
  };

  const handleReject = (taskId: number) => {
    rejectTask(taskId);
    toast.error("Task rejected");
  };

  const handleResolveReport = (reportId: number) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const handleDismissReport = (reportId: number) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-foreground/60 mb-8">Platform overview and management</p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Users,
                label: "Total Users",
                value: "156",
                change: "+12%",
                trend: "up"
              },
              {
                icon: ListChecks,
                label: "Active Tasks",
                value: "89",
                change: "+8%",
                trend: "up"
              },
              {
                icon: Flag,
                label: "Reports",
                value: "3",
                change: "-25%",
                trend: "down"
              },
              {
                icon: BarChart3,
                label: "Revenue",
                value: "$12.5K",
                change: "+15%",
                trend: "up"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-primary" : "text-red-400"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">User Registrations</h2>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        timeRange === range
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background/50 text-foreground/60 hover:bg-background'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[250px] overflow-y-auto overflow-x-hidden pr-2">
                <div className="flex flex-col gap-2.5">
                  {userData.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 min-h-[32px]">
                      <div className="text-sm text-foreground/60 w-16 flex-shrink-0">{item.label}</div>
                      <div className="flex-1 h-8 bg-background/50 rounded-lg relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.users / maxUsers) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-lg flex items-center justify-end pr-3"
                        >
                          <span className="text-sm font-medium">{item.users}</span>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6">Task Activity</h2>
              <div className="h-[250px] flex items-end justify-around gap-4 pb-6">
                {taskData.map((item, index) => (
                  <div key={item.id} className="flex-1 flex flex-col items-center gap-3">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.tasks / 89) * 180}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-xl flex items-start justify-center pt-3"
                    >
                      <span className="text-sm font-medium">{item.tasks}</span>
                    </motion.div>
                    <div className="text-sm text-foreground/60">{item.month}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Reports Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-card rounded-2xl p-6 border border-border mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Flag className="w-6 h-6 text-red-400" />
                User Reports
              </h2>
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">
                {reports.length} active
              </span>
            </div>
            {reports.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">
                <Flag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No active reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-xl bg-background/50 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          report.severity === 'high' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                        }`}>
                          <AlertTriangle className={`w-5 h-5 ${
                            report.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              report.severity === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {report.type}
                            </span>
                            <span className="text-xs text-foreground/60">{report.date}</span>
                          </div>
                          <div className="font-medium mb-1">
                            Task: <span className="text-primary">{report.taskTitle}</span>
                          </div>
                          <div className="text-sm text-foreground/80 mb-2">
                            <strong>Reported User:</strong> {report.reportedUser}
                          </div>
                          <div className="text-sm text-foreground/60 mb-2">
                            <strong>Reported By:</strong> {report.reportedBy}
                          </div>
                          <div className="text-sm text-foreground/70 italic">
                            "{report.reason}"
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          className="px-3 py-2 rounded-xl bg-background hover:bg-muted transition-all flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pending Tasks Approval */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-card rounded-2xl p-6 border border-border mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Pending Task Approvals</h2>
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
                {pendingTasks.length} pending
              </span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">
                No pending tasks to review
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{task.title}</div>
                      <div className="text-sm text-foreground/60 mb-2">
                        Posted by <span className="text-primary">{task.client}</span> • {task.posted}
                      </div>
                      <div className="text-sm">
                        Budget: <span className="text-primary font-medium">{task.budget}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(task.id)}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(task.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tables */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6">Recent Users</h2>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <div className="font-medium mb-1">{user.name}</div>
                      <div className="text-sm text-foreground/60">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm mb-1 ${
                        user.status === "Active" ? "text-primary" : "text-yellow-400"
                      }`}>
                        {user.status}
                      </div>
                      <div className="text-xs text-foreground/60">{user.joined}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6">Recent Tasks</h2>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <div className="font-medium mb-1">{task.title}</div>
                      <div className="text-sm text-foreground/60">{task.client}</div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        task.status === "Completed"
                          ? "bg-primary/10 text-primary"
                          : task.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}