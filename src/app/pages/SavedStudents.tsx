import { Link } from "react-router";
import { motion } from "motion/react";
import { MessageSquare, UserCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../contexts/AuthContext";

type SavedStudent = {
  id: number;
  name: string;
  avatar?: string | null;
  skills?: string[];
};

export default function SavedStudents() {
  const { user } = useAuth();
  const [savedStudents, setSavedStudents] = useState<SavedStudent[]>([]);
  const savedStudentsKey = user ? `saved_students_${user.id}` : "saved_students_guest";

  useEffect(() => {
    const syncSavedStudents = () => {
      setSavedStudents(JSON.parse(localStorage.getItem(savedStudentsKey) || "[]"));
    };

    syncSavedStudents();
    window.addEventListener("storage", syncSavedStudents);

    return () => {
      window.removeEventListener("storage", syncSavedStudents);
    };
  }, [savedStudentsKey]);

  const removeSavedStudent = (studentId: number) => {
    const filtered = savedStudents.filter((student) => student.id !== studentId);
    localStorage.setItem(savedStudentsKey, JSON.stringify(filtered));
    setSavedStudents(filtered);
    window.dispatchEvent(new Event("storage"));
    toast.success("Student removed");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Saved Students</h1>
            <p className="text-foreground/60 mb-8">
              Revisit the student profiles you starred and jump back into conversation anytime.
            </p>

            {savedStudents.length === 0 ? (
              <div className="p-10 bg-card rounded-2xl border border-dashed border-border text-center text-foreground/40">
                <p>You haven't saved any students yet.</p>
                <Link to="/browse" className="text-primary hover:underline text-sm mt-3 inline-block">
                  Browse students
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-full object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <UserCircle className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <h2 className="font-bold text-lg">{student.name}</h2>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.skills?.slice(0, 3).map((skill) => (
                            <span key={skill} className="text-[10px] bg-muted px-2 py-1 rounded text-foreground/60">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/profile/${student.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-primary/10 text-primary text-center text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/profile/${student.id}`}
                        className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all text-foreground/70"
                        title="Message from profile"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeSavedStudent(student.id)}
                        className="px-4 py-2.5 rounded-xl bg-card border border-border hover:text-red-500 hover:border-red-500/30 transition-all text-foreground/70"
                        title="Remove saved student"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
