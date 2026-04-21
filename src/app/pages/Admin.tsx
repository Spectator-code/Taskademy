import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, ListChecks, Flag, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const userData = [
  { month: "Jan", users: 45, id: "user-jan" },
  { month: "Feb", users: 78, id: "user-feb" },
  { month: "Mar", users: 120, id: "user-mar" },
  { month: "Apr", users: 156, id: "user-apr" }
];

const taskData = [
  { month: "Jan", tasks: 23, id: "task-jan" },
  { month: "Feb", tasks: 45, id: "task-feb" },
  { month: "Mar", tasks: 67, id: "task-mar" },
  { month: "Apr", tasks: 89, id: "task-apr" }
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

export default function Admin() {
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
              <h2 className="text-xl font-bold mb-6">User Growth</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userData} id="user-growth-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#a0a0b0" />
                  <YAxis stroke="#a0a0b0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E1E2E",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px"
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#00FF88" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6">Task Activity</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={taskData} id="task-activity-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#a0a0b0" />
                  <YAxis stroke="#a0a0b0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E1E2E",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px"
                    }}
                  />
                  <Bar dataKey="tasks" fill="#00FF88" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Tables */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
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
              transition={{ duration: 0.6, delay: 0.7 }}
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