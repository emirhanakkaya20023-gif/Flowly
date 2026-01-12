import ActionButton from "@/components/common/ActionButton";
import { HiCalendar } from "react-icons/hi2";
import { NewTaskModal } from "@/components/tasks/NewTaskModal";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

interface DashboardHeaderProps {
  currentUser: any;
  greeting: string;
  currentDate: string;
  onTodayAgendaClick: () => void;
}

export function DashboardHeader({
  currentUser,
  greeting,
  currentDate,
  onTodayAgendaClick,
}: DashboardHeaderProps) {
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="dashboard-header">
      <div className="dashboard-user-section">
        <div className="dashboard-user-avatar">
          {currentUser?.firstName?.charAt(0) || "U"}
          {currentUser?.lastName?.charAt(0) || ""}
        </div>
        <div>
          <h1 className="dashboard-greeting">
            {greeting}, {currentUser?.firstName || "User"}!
          </h1>
          <p className="dashboard-date-info">{currentDate} • {t("dashboard.readyMessage")}</p>
        </div>
      </div>

      <div className="dashboard-header-actions">
        <ActionButton
          onClick={onTodayAgendaClick}
          secondary
          rightIcon={<HiCalendar className="dashboard-icon-sm" />}
        >
          {t("dashboard.todaysAgenda")}
        </ActionButton>

        {/* New Task Button and Modal */}
        {(() => {
          return (
            <>
              <ActionButton showPlusIcon primary onClick={() => setNewTaskModalOpen(true)}>
                {t("tasks.newTask")}
              </ActionButton>
              <NewTaskModal
                isOpen={isNewTaskModalOpen}
                onClose={() => setNewTaskModalOpen(false)}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
}
