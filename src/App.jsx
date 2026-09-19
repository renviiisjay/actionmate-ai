
import { useState } from "react";
import "./App.css";

const INITIAL_SIGNALS = [
  {
    title: "Sales performance below baseline",
    description: "Current sales are 24% below the recent operating baseline.",
    priority: "HIGH",
    time: "12 min ago",
  },
  {
    title: "Payment failures increased",
    description: "Payment failure rate is 18% above the normal range.",
    priority: "HIGH",
    time: "9 min ago",
  },
  {
    title: "Merchant follow-up overdue",
    description: "A high-value operational follow-up has not been completed.",
    priority: "MEDIUM",
    time: "31 min ago",
  },
];

const INITIAL_ACTIONS = [
  {
    id: "ACT-7841",
    title: "Address payment failure + notify merchant",
    area: "Merchant Operations",
    mode: "APPROVAL",
    status: "READY",
  },
  {
    id: "ACT-7838",
    title: "Create payment issue follow-up",
    area: "Customer Experience",
    mode: "AUTO",
    status: "READY",
  },
  {
    id: "ACT-7834",
    title: "Flag sales recovery opportunity",
    area: "Sales Operations",
    mode: "AUTO",
    status: "READY",
  },
];

const INITIAL_ACTIVITIES = [
  {
    text: "ActionMate AI initialized the operating context.",
    time: "Just now",
  },
  {
    text: "Monitoring transaction, merchant and support signals.",
    time: "Just now",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState("command");

  const [workflowStep, setWorkflowStep] = useState(0);
  const [workflowRunning, setWorkflowRunning] = useState(false);

  const [approvalRequired, setApprovalRequired] = useState(false);
  const [approved, setApproved] = useState(false);

  const [actionExecuted, setActionExecuted] = useState(false);
  const [outcomeRecorded, setOutcomeRecorded] = useState(false);

  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  const [executedCount, setExecutedCount] = useState(0);
  const [outcomesCount, setOutcomesCount] = useState(0);

  const [fileName, setFileName] = useState("");
  const [fileStatus, setFileStatus] = useState("");

  const [outcomeMessage, setOutcomeMessage] = useState(
    "No completed action has been measured yet."
  );

  const navigateTo = (tab) => {
    setActiveTab(tab);
  };

  const addActivity = (text) => {
    setActivities((current) => [
      {
        text,
        time: "Just now",
      },
      ...current,
    ]);
  };

  /*
   * STEP 1 → STEP 2 → STEP 3
   * Understand → Decide → Approval Required
   */
  const simulateWorkflow = () => {
    if (workflowRunning) return;

    setActiveTab("command");

    setWorkflowRunning(true);
    setWorkflowStep(1);

    setApprovalRequired(false);
    setApproved(false);

    setActionExecuted(false);
    setOutcomeRecorded(false);

    setOutcomeMessage("Action is being evaluated.");

    addActivity("AI teammate started a new decision workflow.");

    window.setTimeout(() => {
      setWorkflowStep(2);

      addActivity(
        "AI correlated sales performance and payment failure signals."
      );
    }, 1000);

    window.setTimeout(() => {
      setWorkflowStep(3);

      setApprovalRequired(true);
      setWorkflowRunning(false);

      addActivity(
        "Approval required before the proposed action can execute."
      );
    }, 2000);
  };

  /*
   * APPROVAL
   */
  const approveAction = () => {
    setApprovalRequired(false);
    setApproved(true);
    setWorkflowStep(3);

    addActivity("Human approval granted for ACT-7841.");
  };

  /*
   * EXECUTION → OUTCOME
   */
  const runAction = () => {
    if (actionExecuted || workflowRunning) return;

    if (approvalRequired && !approved) {
      setActiveTab("approvals");
      return;
    }

    if (!approved && workflowStep === 0) {
      setActiveTab("command");

      addActivity(
        "Action execution is waiting for the AI workflow."
      );

      return;
    }

    setWorkflowRunning(true);
    setWorkflowStep(4);

    addActivity("ACT-7841 execution started.");

    setActions((current) =>
      current.map((action) =>
        action.id === "ACT-7841"
          ? {
              ...action,
              status: "EXECUTED",
            }
          : action
      )
    );

    setExecutedCount((count) => count + 1);
    setActionExecuted(true);

    window.setTimeout(() => {
      setWorkflowStep(5);

      setWorkflowRunning(false);
      setOutcomeRecorded(true);

      setOutcomesCount((count) => count + 1);

      setOutcomeMessage(
        "Execution completed. Outcome tracking is now active for ACT-7841."
      );

      addActivity(
        "ACT-7841 executed successfully; outcome tracking started."
      );
    }, 1000);
  };

  /*
   * RESET
   */
  const resetWorkflow = () => {
    setWorkflowStep(0);
    setWorkflowRunning(false);

    setApprovalRequired(false);
    setApproved(false);

    setActionExecuted(false);
    setOutcomeRecorded(false);

    setActions(INITIAL_ACTIONS);

    setOutcomeMessage(
      "No completed action has been measured yet."
    );

    addActivity("Workflow state was reset by the operator.");

    setActiveTab("command");
  };

  /*
   * DATA INTELLIGENCE UPLOAD
   */
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const lowerName = file.name.toLowerCase();

    const valid =
      lowerName.endsWith(".csv") ||
      lowerName.endsWith(".json");

    if (!valid) {
      setFileName("");
      setFileStatus("Upload a CSV or JSON file.");

      addActivity(
        "Data upload rejected: unsupported file type."
      );

      event.target.value = "";

      return;
    }

    setFileName(file.name);

    setFileStatus(
      "File received. Intelligence pipeline ready."
    );

    addActivity(
      `Dataset uploaded to Data Intelligence: ${file.name}.`
    );

    event.target.value = "";
  };

  /*
   * WORKFLOW STATUS
   */
  const getWorkflowStatus = () => {
    if (outcomeRecorded) {
      return {
        label: "SUCCESS",
        className: "success",
      };
    }

    if (approvalRequired) {
      return {
        label: "APPROVAL REQUIRED",
        className: "approval",
      };
    }

    if (workflowRunning) {
      return {
        label: "WORKING",
        className: "working",
      };
    }

    if (approved) {
      return {
        label: "APPROVED",
        className: "working",
      };
    }

    return {
      label: "READY",
      className: "ready",
    };
  };

  const status = getWorkflowStatus();

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={navigateTo}
      />

      <main className="main-content">
        <Topbar />

        {activeTab === "command" && (
          <CommandCenter
            workflowStep={workflowStep}
            workflowRunning={workflowRunning}
            approvalRequired={approvalRequired}
            approved={approved}
            actionExecuted={actionExecuted}
            outcomeRecorded={outcomeRecorded}
            status={status}
            executedCount={executedCount}
            outcomesCount={outcomesCount}
            actions={actions}
            onRunAction={runAction}
            onSimulate={simulateWorkflow}
            onApprove={approveAction}
            onReset={resetWorkflow}
            onNavigate={navigateTo}
          />
        )}

        {activeTab === "signals" && (
          <SignalsPage
            signals={INITIAL_SIGNALS}
            onNavigate={navigateTo}
          />
        )}

        {activeTab === "actions" && (
          <ActionsPage
            actions={actions}
            onRunAction={runAction}
            onNavigate={navigateTo}
          />
        )}

        {activeTab === "approvals" && (
          <ApprovalsPage
            approvalRequired={approvalRequired}
            approved={approved}
            actionExecuted={actionExecuted}
            onApprove={approveAction}
            onRunAction={runAction}
            onSimulate={simulateWorkflow}
          />
        )}

        {activeTab === "data" && (
          <DataIntelligencePage
            fileName={fileName}
            fileStatus={fileStatus}
            onUpload={handleFileUpload}
          />
        )}

        {activeTab === "activity" && (
          <ActivityPage
            activities={activities}
          />
        )}

        {activeTab === "outcomes" && (
          <OutcomesPage
            outcomeRecorded={outcomeRecorded}
            executedCount={executedCount}
            outcomesCount={outcomesCount}
            outcomeMessage={outcomeMessage}
          />
        )}
      </main>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activeTab,
  onNavigate,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          A
        </div>

        <div>
          <div className="brand-name">
            ACTIONMATE AI
          </div>

          <div className="brand-subtitle">
            AUTONOMOUS OPERATIONS
          </div>
        </div>
      </div>

      <div className="environment-card">
        <span className="environment-label">
          ENVIRONMENT
        </span>

        <div className="environment-row">
          <span className="status-dot"></span>
          Hackathon Sandbox
        </div>

        <div className="environment-version">
          v1.0 • Synthetic data
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavItem
          label="Command Center"
          active={activeTab === "command"}
          onClick={() => onNavigate("command")}
        />

        <NavItem
          label="Signals"
          active={activeTab === "signals"}
          onClick={() => onNavigate("signals")}
          count={3}
        />

        <NavItem
          label="Action Queue"
          active={activeTab === "actions"}
          onClick={() => onNavigate("actions")}
        />

        <NavItem
          label="Approvals"
          active={activeTab === "approvals"}
          onClick={() => onNavigate("approvals")}
          count={1}
        />

        <NavItem
          label="Data Intelligence"
          active={activeTab === "data"}
          onClick={() => onNavigate("data")}
        />

        <NavItem
          label="Activity"
          active={activeTab === "activity"}
          onClick={() => onNavigate("activity")}
        />

        <NavItem
          label="Outcomes"
          active={activeTab === "outcomes"}
          onClick={() => onNavigate("outcomes")}
        />
      </nav>

      <div className="sidebar-footer">
        <div className="footer-label">
          GOVERNANCE
        </div>

        <div className="footer-value">
          Human oversight enabled
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  label,
  active,
  onClick,
  count,
}) {
  return (
    <button
      type="button"
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>

      {count ? (
        <span className="nav-count">
          {count}
        </span>
      ) : null}
    </button>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <div className="topbar-brand">
          PAYTM ACTIONMATE AI
        </div>

        <div className="topbar-title">
          AI teammates for the next generation of payments
        </div>
      </div>

      <div className="topbar-right">
        <div className="ai-status">
          <span className="status-dot"></span>
          AI teammate online
        </div>

        <div className="profile-circle">
          RV
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   COMMAND CENTER
========================================================= */

function CommandCenter({
  workflowStep,
  workflowRunning,
  approvalRequired,
  approved,
  actionExecuted,
  outcomeRecorded,
  status,
  executedCount,
  outcomesCount,
  actions,
  onRunAction,
  onSimulate,
  onApprove,
  onReset,
  onNavigate,
}) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="COMMAND CENTER"
        title="AI Operations Command Center"
        description="ActionMate AI understands operating context, makes a decision, executes approved work and measures the resulting outcome."
      />

      <div className="command-status-row">
        <div>
          <span className="status-indicator"></span>
          Live operating context
        </div>

        <span
          className={`workflow-status ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="kpi-grid">
        <MiniKPI
          label="ACTIVE SIGNALS"
          value="03"
          detail="Across payments and operations"
        />

        <MiniKPI
          label="AI DECISIONS"
          value={workflowStep >= 2 ? "01" : "00"}
          detail="Context-aware recommendations"
        />

        <MiniKPI
          label="EXECUTED ACTIONS"
          value={String(executedCount).padStart(2, "0")}
          detail="Approved autonomous work"
        />

        <MiniKPI
          label="OUTCOMES TRACKED"
          value={String(outcomesCount).padStart(2, "0")}
          detail="Measured after execution"
        />
      </div>

      <section className="workflow-card">
        <div className="card-header">
          <div>
            <div className="card-eyebrow">
              LIVE WORKFLOW
            </div>

            <div className="card-title-row">
              <h2>
                Merchant sales recovery
              </h2>

              <span className="priority-badge">
                HIGH PRIORITY
              </span>
            </div>

            <p className="card-description">
              AI detected a meaningful sales deviation
              and correlated it with an increase in
              payment failures.
            </p>
          </div>

          <div className="signal-label">
            <span className="signal-dot"></span>
            2 correlated signals
          </div>
        </div>

        <div className="workflow">
          <WorkflowStep
            number="01"
            title="UNDERSTAND"
            text="Read transaction and operating signals."
            active={workflowStep >= 1}
            complete={workflowStep > 1}
          />

          <WorkflowStep
            number="02"
            title="DECIDE"
            text="Select the highest-value next action."
            active={workflowStep >= 2}
            complete={workflowStep > 2}
          />

          <WorkflowStep
            number="03"
            title="ACT"
            text="Apply governance before execution."
            active={workflowStep >= 3}
            complete={workflowStep > 4}
          />

          <WorkflowStep
            number="04"
            title="MEASURE"
            text="Track whether the action changed the outcome."
            active={workflowStep >= 5}
            complete={workflowStep >= 5}
          />
        </div>
      </section>

      <div className="workspace-grid">
        <DecisionCard
          workflowStep={workflowStep}
          workflowRunning={workflowRunning}
          approvalRequired={approvalRequired}
          approved={approved}
          actionExecuted={actionExecuted}
          outcomeRecorded={outcomeRecorded}
          onRunAction={onRunAction}
          onApprove={onApprove}
          onSimulate={onSimulate}
          onReset={onReset}
        />

        <ContextCard />
      </div>

      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="card-eyebrow">
                DETECTION
              </div>

              <h3>
                Live signals
              </h3>
            </div>

            <button
              type="button"
              className="small-button"
              onClick={() => onNavigate("signals")}
            >
              View all
            </button>
          </div>

          <div className="signal-list">
            <SignalRow
              title="Sales performance below baseline"
              description="Sales are 24% below the recent baseline."
              priority="HIGH"
              time="12 min"
            />

            <SignalRow
              title="Payment failures increased"
              description="Failure rate is 18% above normal."
              priority="HIGH"
              time="9 min"
            />

            <SignalRow
              title="Merchant follow-up overdue"
              description="Operational follow-up is pending."
              priority="MEDIUM"
              time="31 min"
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <div className="card-eyebrow">
                EXECUTION
              </div>

              <h3>
                Action queue
              </h3>
            </div>

            <button
              type="button"
              className="small-button"
              onClick={() => onNavigate("actions")}
            >
              View all
            </button>
          </div>

          <div className="action-list">
            {actions.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="disclaimer">
        Hackathon prototype using synthetic operating data;
        not connected to Paytm production systems.
      </div>
    </div>
  );
}

/* =========================================================
   DECISION CARD
========================================================= */

function DecisionCard({
  workflowStep,
  workflowRunning,
  approvalRequired,
  approved,
  actionExecuted,
  outcomeRecorded,
  onRunAction,
  onApprove,
  onSimulate,
  onReset,
}) {
  const canExecute =
    approved &&
    !actionExecuted &&
    !workflowRunning &&
    !approvalRequired;

  return (
    <section className="decision-card">
      <div className="decision-header">
        <div>
          <div className="card-eyebrow">
            AI DECISION
          </div>

          <h2>
            Address payment failure + notify merchant
          </h2>

          <div className="decision-meta">
            <span className="decision-ready">
              {outcomeRecorded
                ? "OUTCOME TRACKING"
                : approved
                ? "APPROVED"
                : approvalRequired
                ? "AWAITING APPROVAL"
                : "RECOMMENDED"}
            </span>

            <span>
              ACT-7841
            </span>

            <span>
              Merchant Operations
            </span>
          </div>
        </div>

        <div className="confidence-box">
          <strong>
            91%
          </strong>

          <span>
            confidence
          </span>
        </div>
      </div>

      <div className="reasoning-section">
        <div className="section-label">
          WHY THIS ACTION
        </div>

        <div className="reasoning-list">
          <ReasoningItem
            number="01"
            title="Sales are 24% below baseline"
            text="The deviation is large enough to warrant intervention."
          />

          <ReasoningItem
            number="02"
            title="Payment failures are 18% higher"
            text="The failure increase provides a plausible operational driver."
          />

          <ReasoningItem
            number="03"
            title="Merchant notification is actionable"
            text="The proposed action addresses the signal while preserving human oversight."
          />
        </div>
      </div>

      <div className="decision-actions">
        <button
          type="button"
          className="primary-button"
          onClick={onRunAction}
          disabled={!canExecute}
        >
          {actionExecuted
            ? "Action Executed"
            : workflowRunning
            ? "Working..."
            : "Execute Action"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onSimulate}
          disabled={workflowRunning}
        >
          Simulate AI Workflow
        </button>

        <button
          type="button"
          className="text-button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      {approvalRequired && !approved && (
        <div className="approval-notice">
          <div>
            <strong>
              Human approval required
            </strong>

            <p>
              This action can affect merchant
              operations, so ActionMate AI has paused
              before execution.
            </p>
          </div>

          <button
            type="button"
            className="approval-button"
            onClick={onApprove}
          >
            Approve Action
          </button>
        </div>
      )}

      {approved && !actionExecuted && (
        <div className="approval-notice">
          <div>
            <strong>
              Action approved
            </strong>

            <p>
              Governance checks are complete. The
              approved action is ready to execute.
            </p>
          </div>

          <button
            type="button"
            className="approval-button"
            onClick={onRunAction}
          >
            Execute Now
          </button>
        </div>
      )}

      {actionExecuted && (
        <div className="success-notice">
          <div>
            <strong>
              {outcomeRecorded
                ? "Outcome tracking started"
                : "Action executed"}
            </strong>

            <p>
              {outcomeRecorded
                ? "ACT-7841 completed successfully and its business outcome is now being measured."
                : "ACT-7841 completed successfully."}
            </p>
          </div>
        </div>
      )}

      <div className="decision-metrics">
        <div>
          <span>
            EXPECTED RESPONSE
          </span>

          <strong>
            &lt; 5 min
          </strong>
        </div>

        <div>
          <span>
            GOVERNANCE
          </span>

          <strong>
            Human approval
          </strong>
        </div>

        <div>
          <span>
            WORKFLOW STATE
          </span>

          <strong>
            {workflowStep >= 5
              ? "Measured"
              : "In progress"}
          </strong>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   AI TEAMMATE CONTEXT
========================================================= */

function ContextCard() {
  return (
    <section className="context-card">
      <div className="card-eyebrow">
        AI TEAMMATE
      </div>

      <div className="context-heading">
        <h2>
          ActionMate AI
        </h2>

        <div className="online-badge">
          <span className="status-dot"></span>
          ONLINE
        </div>
      </div>

      <p className="context-description">
        The teammate combines operating context,
        business rules and recent activity before
        recommending an action.
      </p>

      <div className="context-sources">
        <ContextItem text="Transaction signals" />
        <ContextItem text="Merchant profile" />
        <ContextItem text="Support context" />
        <ContextItem text="Operational analytics" />
      </div>

      <div className="policy-section">
        <div className="section-label">
          GOVERNANCE MODE
        </div>

        <div className="governance-list">
          <GovernanceItem
            title="AUTO"
            text="Routine, low-risk operational actions."
          />

          <GovernanceItem
            title="APPROVAL"
            text="Important decisions pause for human review."
            active
          />

          <GovernanceItem
            title="ESCALATE"
            text="Sensitive cases are routed to expert judgment."
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WORKFLOW
========================================================= */

function WorkflowStep({
  number,
  title,
  text,
  active,
  complete,
}) {
  return (
    <div
      className={`workflow-step ${
        active ? "active" : ""
      } ${
        complete ? "completed" : ""
      }`}
    >
      <div className="workflow-step-number">
        {complete ? "✓" : number}
      </div>

      <div className="workflow-line"></div>

      <div className="workflow-step-title">
        {title}
      </div>

      <div className="workflow-step-description">
        {text}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ReasoningItem({
  number,
  title,
  text,
}) {
  return (
    <div className="reasoning-item">
      <span>
        {number}
      </span>

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>
      </div>
    </div>
  );
}

function ContextItem({ text }) {
  return (
    <div className="context-item">
      <span className="context-check">
        ✓
      </span>

      {text}
    </div>
  );
}

function GovernanceItem({
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`governance-item ${
        active ? "active" : ""
      }`}
    >
      <div className="governance-title">
        {title}
      </div>

      <div className="governance-text">
        {text}
      </div>
    </div>
  );
}

function SignalRow({
  title,
  description,
  priority,
  time,
}) {
  return (
    <div className="signal-row">
      <div className="signal-row-main">
        <div className="signal-row-title">
          {title}
        </div>

        <div className="signal-row-description">
          {description}
        </div>
      </div>

      <div className="signal-row-right">
        <span
          className={`priority ${priority.toLowerCase()}`}
        >
          {priority}
        </span>

        <span className="row-time">
          {time}
        </span>
      </div>
    </div>
  );
}

function ActionRow({ action }) {
  const isExecuted =
    action.status.toLowerCase() === "executed";

  return (
    <div className="action-row">
      <div className="action-row-main">
        <div className="action-id">
          {action.id}
        </div>

        <div className="action-title">
          {action.title}
        </div>

        <div className="action-area">
          {action.area}
        </div>
      </div>

      <div className="action-row-right">
        <span className="action-mode">
          {action.mode}
        </span>

        <span
          className={`action-status ${
            isExecuted
              ? "executed"
              : "ready"
          }`}
        >
          {action.status}
        </span>
      </div>
    </div>
  );
}

function MiniKPI({
  label,
  value,
  detail,
}) {
  return (
    <div className="mini-kpi">
      <div className="mini-kpi-label">
        {label}
      </div>

      <div className="mini-kpi-value">
        {value}
      </div>

      <div className="mini-kpi-detail">
        {detail}
      </div>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page-header">
      <div className="card-eyebrow">
        {eyebrow}
      </div>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>
    </div>
  );
}

function PageSection({
  eyebrow,
  title,
  children,
}) {
  return (
    <section className="page-section">
      {eyebrow && (
        <div className="card-eyebrow">
          {eyebrow}
        </div>
      )}

      {title && (
        <h2>
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}

/* =========================================================
   SIGNALS PAGE
========================================================= */

function SignalsPage({
  signals,
  onNavigate,
}) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="SIGNALS"
        title="Operating Signals"
        description="ActionMate AI continuously watches the signals that can change merchant operations, customer experience and sales performance."
      />

      <div className="page-stat-grid">
        <MiniKPI
          label="ACTIVE"
          value="03"
          detail="Signals requiring attention"
        />

        <MiniKPI
          label="HIGH PRIORITY"
          value="02"
          detail="Immediate operational relevance"
        />

        <MiniKPI
          label="CORRELATED"
          value="02"
          detail="Signals used in current decision"
        />
      </div>

      <PageSection
        eyebrow="DETECTION STREAM"
        title="Current operating signals"
      >
        <div className="signal-list">
          {signals.map((signal) => (
            <SignalRow
              key={signal.title}
              {...signal}
            />
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="NEXT STEP"
        title="From signals to decisions"
      >
        <p className="card-description">
          ActionMate AI does not stop at detection.
          Correlated signals become decision context
          and can enter the governed action queue.
        </p>

        <div className="decision-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              onNavigate("command")
            }
          >
            Open Command Center
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              onNavigate("actions")
            }
          >
            View Action Queue
          </button>
        </div>
      </PageSection>
    </div>
  );
}

/* =========================================================
   ACTION QUEUE PAGE
========================================================= */

function ActionsPage({
  actions,
  onRunAction,
  onNavigate,
}) {
  const firstAction = actions.find(
    (action) => action.id === "ACT-7841"
  );

  const executable =
    firstAction?.status === "READY";

  return (
    <div className="page">
      <PageHeader
        eyebrow="ACTION QUEUE"
        title="Governed Action Queue"
        description="Actions are selected from operating context and remain subject to their configured governance mode."
      />

      <PageSection
        eyebrow="QUEUE"
        title="Pending and completed actions"
      >
        <div className="action-list">
          {actions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
            />
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="PRIMARY ACTION"
        title="ACT-7841"
      >
        <div className="approval-page-card">
          <div>
            <div className="approval-action-id">
              ACT-7841
            </div>

            <strong>
              Address payment failure + notify merchant
            </strong>

            <p>
              This action addresses the strongest
              correlated operating signal from the
              current decision workflow.
            </p>

            <div className="approval-details">
              <span>
                Merchant Operations
              </span>

              <span>
                Approval required
              </span>

              <span>
                91% confidence
              </span>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (executable) {
                onNavigate("approvals");
              } else {
                onRunAction();
              }
            }}
          >
            {executable
              ? "Review Approval"
              : "Open Workflow"}
          </button>
        </div>
      </PageSection>
    </div>
  );
}

/* =========================================================
   APPROVALS PAGE
========================================================= */

function ApprovalsPage({
  approvalRequired,
  approved,
  actionExecuted,
  onApprove,
  onRunAction,
  onSimulate,
}) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="APPROVALS"
        title="Human Governance"
        description="ActionMate AI pauses important operational decisions so a human can review and authorize execution."
      />

      <div className="governance-banner">
        <div>
          <div className="card-eyebrow">
            GOVERNANCE CONTROL
          </div>

          <strong>
            Human oversight is enabled
          </strong>

          <p>
            Approval is required for high-impact
            operational actions.
          </p>
        </div>

        <span className="governance-enabled">
          ENABLED
        </span>
      </div>

      <PageSection
        eyebrow="PENDING REVIEW"
        title="ACT-7841"
      >
        <div className="approval-page-card">
          <div>
            <div className="approval-action-id">
              ACT-7841
            </div>

            <strong>
              Address payment failure + notify merchant
            </strong>

            <p>
              Resolve the detected payment issue and
              notify the merchant after the approved
              operational workflow is executed.
            </p>

            <div className="approval-details">
              <span>
                HIGH PRIORITY
              </span>

              <span>
                91% CONFIDENCE
              </span>

              <span>
                MERCHANT OPERATIONS
              </span>
            </div>
          </div>

          {actionExecuted ? (
            <span className="success-badge">
              EXECUTED
            </span>
          ) : approved ? (
            <button
              type="button"
              className="primary-button"
              onClick={onRunAction}
            >
              Execute Action
            </button>
          ) : approvalRequired ? (
            <button
              type="button"
              className="primary-button"
              onClick={onApprove}
            >
              Approve Action
            </button>
          ) : (
            <button
              type="button"
              className="secondary-button"
              onClick={onSimulate}
            >
              Start AI Workflow
            </button>
          )}
        </div>
      </PageSection>

      <div className="approval-policy-grid">
        <GovernanceItem
          title="AUTO"
          text="Routine, low-risk actions can execute without manual approval."
        />

        <GovernanceItem
          title="APPROVAL"
          text="Important actions pause until an authorized human approves."
          active
        />

        <GovernanceItem
          title="ESCALATE"
          text="Sensitive or ambiguous cases are routed to expert review."
        />
      </div>
    </div>
  );
}

/* =========================================================
   DATA INTELLIGENCE
========================================================= */

function DataIntelligencePage({
  fileName,
  fileStatus,
  onUpload,
}) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="DATA INTELLIGENCE"
        title="Data Intelligence"
        description="Upload a synthetic CSV or JSON dataset here to demonstrate how raw operational data becomes structured intelligence."
      />

      <div className="data-intelligence-grid">
        <section className="data-upload-card">
          <div className="card-eyebrow">
            DATA INPUT
          </div>

          <h2>
            Upload operating data
          </h2>

          <p>
            Add a CSV or JSON dataset to simulate the
            intelligence layer behind ActionMate AI.
            Dataset upload is intentionally isolated to
            this workspace.
          </p>

          <label className="upload-button">
            Choose dataset

            <input
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={onUpload}
            />
          </label>

          {fileName && (
            <div className="uploaded-file">
              <strong>
                {fileName}
              </strong>

              <span>
                {fileStatus ||
                  "Ready for intelligence processing."}
              </span>
            </div>
          )}

          {!fileName && fileStatus && (
            <div className="upload-error">
              {fileStatus}
            </div>
          )}
        </section>

        <section className="data-overview-card">
          <div className="card-eyebrow">
            INTELLIGENCE PIPELINE
          </div>

          <h2>
            From data to action
          </h2>

          <div className="data-flow">
            <DataFlowStep
              number="01"
              title="INGEST"
              text="Read transaction and operating records."
            />

            <DataFlowStep
              number="02"
              title="ANALYZE"
              text="Detect deviations and relevant patterns."
            />

            <DataFlowStep
              number="03"
              title="DECIDE"
              text="Generate a contextual next-best action."
            />

            <DataFlowStep
              number="04"
              title="MEASURE"
              text="Track execution and business outcomes."
            />
          </div>
        </section>
      </div>

      <div className="data-metrics-grid">
        <MiniKPI
          label="ROWS READY"
          value="12.4K"
          detail="Illustrative dataset"
        />

        <MiniKPI
          label="SIGNALS"
          value="03"
          detail="Detected operating signals"
        />

        <MiniKPI
          label="FEATURES"
          value="18"
          detail="Context variables"
        />

        <MiniKPI
          label="QUALITY"
          value="98%"
          detail="Illustrative data quality"
        />
      </div>

      <div className="data-note">
        <div className="card-eyebrow">
          PROTOTYPE NOTE
        </div>

        <strong>
          Synthetic demonstration environment
        </strong>

        <p>
          Uploaded files are used only to demonstrate
          the data intelligence layer in this prototype.
          No Paytm production data is connected.
        </p>
      </div>
    </div>
  );
}

function DataFlowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="data-flow-step">
      <strong>
        {number}
      </strong>

      <span>
        {title}
      </span>

      <p>
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function ActivityPage({
  activities,
}) {
  const aiEvents = activities.filter(
    (item) =>
      item.text
        .toLowerCase()
        .includes("ai")
  ).length;

  return (
    <div className="page">
      <PageHeader
        eyebrow="ACTIVITY"
        title="AI Activity Log"
        description="A chronological record of decisions, approvals, executions and operator interactions."
      />

      <div className="activity-summary">
        <MiniKPI
          label="EVENTS"
          value={String(
            activities.length
          ).padStart(2, "0")}
          detail="Recorded in this session"
        />

        <MiniKPI
          label="AI EVENTS"
          value={String(
            aiEvents
          ).padStart(2, "0")}
          detail="Generated by teammate"
        />

        <MiniKPI
          label="GOVERNANCE"
          value="ON"
          detail="Human oversight active"
        />
      </div>

      <div className="activity-list">
        <div className="list-heading">
          <div>
            <div className="card-eyebrow">
              EVENT STREAM
            </div>

            <h3>
              Recent activity
            </h3>
          </div>

          <span className="list-status">
            LIVE
          </span>
        </div>

        {activities.map(
          (activity, index) => (
            <div
              className="activity-row"
              key={`${activity.text}-${index}`}
            >
              <span className="activity-dot"></span>

              <div>
                <strong>
                  {activity.text}
                </strong>

                <span>
                  {activity.time}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   OUTCOMES
========================================================= */

function OutcomesPage({
  outcomeRecorded,
  executedCount,
  outcomesCount,
  outcomeMessage,
}) {
  return (
    <div className="page">
      <PageHeader
        eyebrow="OUTCOMES"
        title="Outcome Measurement"
        description="ActionMate AI closes the loop by measuring what happened after an approved action was executed."
      />

      <div className="outcome-grid">
        <OutcomeMetric
          label="ACTIONS EXECUTED"
          value={String(
            executedCount
          ).padStart(2, "0")}
          text="Approved actions completed in this session."
        />

        <OutcomeMetric
          label="OUTCOMES TRACKED"
          value={String(
            outcomesCount
          ).padStart(2, "0")}
          text="Completed actions with measurement started."
        />

        <OutcomeMetric
          label="RESPONSE TARGET"
          value="< 5m"
          text="Illustrative operational response target."
        />

        <OutcomeMetric
          label="MEASUREMENT"
          value={
            outcomeRecorded
              ? "LIVE"
              : "READY"
          }
          text="Outcome telemetry for the current action."
        />
      </div>

      <section className="outcome-card">
        <div className="outcome-header">
          <div>
            <div className="card-eyebrow">
              CURRENT OUTCOME
            </div>

            <h2>
              ACT-7841 — Merchant payment recovery
            </h2>

            <p>
              {outcomeMessage}
            </p>
          </div>

          <span
            className={`outcome-status ${
              outcomeRecorded
                ? "active"
                : ""
            }`}
          >
            {outcomeRecorded
              ? "TRACKING ACTIVE"
              : "AWAITING EXECUTION"}
          </span>
        </div>
      </section>

      <div className="data-note">
        <div className="card-eyebrow">
          MEASUREMENT PRINCIPLE
        </div>

        <strong>
          Success is measured in outcomes, not conversations.
        </strong>

        <p>
          The prototype records execution first and
          then begins an outcome measurement state,
          demonstrating the closed-loop AI teammate model.
        </p>
      </div>
    </div>
  );
}

function OutcomeMetric({
  label,
  value,
  text,
}) {
  return (
    <div className="outcome-metric">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <p>
        {text}
      </p>
    </div>
  );
}

export default App;
