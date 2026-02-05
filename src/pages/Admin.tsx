import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { SubmissionEditModal } from "@/components/admin/SubmissionEditModal";
import { getSubmissions, Submission } from "@/services/admin";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loader2, FileX } from "lucide-react";

export default function Admin() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSubmissions = async () => {
    console.log("🔍 Starting fetchSubmissions...");
    setLoading(true);

    try {
      const data = await getSubmissions();
      console.log("📦 Raw data from API:", data);
      console.log("📦 Data type:", typeof data);
      console.log("📦 Is Array?:", Array.isArray(data));

      if (!Array.isArray(data)) {
        console.error("❌ Data is not an array!");
        setSubmissions([]);
        setLoading(false);
        return;
      }

      // Filter to show only submissions with status "submitted"
      const pendingSubmissions = data.filter(
        (submission) => submission.status === "submitted"
      );

      console.log("✅ Filtered submissions:", pendingSubmissions);
      console.log("✅ Count:", pendingSubmissions.length);

      setSubmissions(pendingSubmissions);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error in fetchSubmissions:", error);
      setSubmissions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Admin component mounted");
    fetchSubmissions();
  }, []);

  const handleSubmissionClick = (submission: Submission) => {
    console.log("👆 Submission clicked:", submission);
    setSelectedSubmission(submission);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleUpdate = () => {
    fetchSubmissions();
  };

  console.log("🎨 Rendering Admin component", {
    loading,
    submissionsCount: submissions.length,
    modalOpen,
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <PageHeader title="Admin Dashboard" showBack />

        <main className="p-4 pb-24">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Pending Submissions
            </h2>
            <p className="text-sm text-muted-foreground">
              Review and manage route submissions
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileX className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No pending submissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SubmissionCard
                    submission={submission}
                    onClick={() => handleSubmissionClick(submission)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        <SubmissionEditModal
          submission={selectedSubmission}
          open={modalOpen}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      </div>
    </AdminGuard>
  );
}
