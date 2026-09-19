import { useState } from "react";
import "./App.css";

const initialSignals = [
  {
    title: "Sales decline detected",
    description: "Transaction volume is 24% below the recent baseline.",
    priority: "High",
    time: "2 min ago",
  },
  {
    title: "Payment failure spike",
    description: "Failed transactions increased significantly this week.",
    priority: "High",
    time: "6 min ago",
  },
  {
    title: "Follow-up opportunity",
    description: "12 merchant interactions require follow-up.",
    priority: "Medium",
    time: "18 min ago",
  },
];

const initialActions = [
  {
    id: "ACT-7841",
    title: "Address payment failure + notify merchant",
    category: "Payment Recovery",
    mode: "Approval",
    status: "Ready",
  },
  {
    id: "ACT-7839",
    title: "Create merchant follow-up task",
    category: "CRM",
    mode: "Auto",
    status: "Executed",
  },
  {
    id: "ACT-7836",
    title: "Send payment troubleshooting notification",
    category: "Customer Experience",
    mode: "Auto",
    status: "Executed",
  },
];

const initialActivities = [
  {
    time: "09:42:11",
    title: "Sales decline signal detected",
    description: "Transaction volume moved below the recent baseline.",
    type: "Signal",
  },
  {
    time: "09:42:12",
    title: "Operational context analyzed",
    description: "Transaction, merchant and analytics signals correlated.",
    type: "AI",
  },
  {
    time: "09:42:13",
    title: "Next-best action generated",
    description: "Payment recovery and merchant notification recommended.",
    type: "Decision",
  },
  {
    time: "09:41:48",
    title: "Merchant follow-up task completed",
    description: "CRM follow-up action executed successfully.",
    type: "Action",
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

  const [actions, setActions] = useState(initialActions);
  const [activities, setActivities] = useState(initialActivities);

  const [aiDecisions, setAiDecisions] = useState(18);
  const [executedCount, setExecutedCount] = useState(31);
  const [outcomesCount, setOutcomesCount] = useState(27);

  const [fileName, setFileName] = useState("");
  const [fileStatus, setFileStatus] = useState("");

  const [outcomeMessage, setOutcomeMessage] = useState("");

  const addActivity = (title, description, type) => {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setActivities((current) => [
      {
        time,
        title,
        description,
        type,
      },
      ...current,
    ]);
  };

  const simulateWorkflow = () => {
    if (workflowRunning) return;

    setActiveTab("command");
    setWorkflowRunning(true);

    setWorkflowStep(1);
    setApprovalRequired(false);
    setApproved(false);
    setActionExecuted(false);
    setOutcomeRecorded(false);
    setOutcomeMessage("");

    addActivity(
      "Signal detected",
      "Sales are 24% below the recent baseline while payment failures increased.",
      "Signal"
    );

    setTimeout(() => {
      setWorkflowStep(2);
      setAiDecisions((current) => current + 1);

      addActivity(
        "Context analyzed",
        "Transaction, merchant, support and analytics context correlated.",
        "AI"
      );
    }, 1000);

    setTimeout(() => {
      setWorkflowStep(3);
      setApprovalRequired(true);
      setWorkflowRunning(false);

      addActivity(
        "Recommendation generated",
        "ActionMate recommends addressing payment failure and notifying the merchant.",
        "Decision"
      );
    }, 2000);
  };

  const approveAction = () => {
    setApproved(true);
    setApprovalRequired(false);
    setWorkflowStep(3);

    addActivity(
      "Human approval received",
      "Authorized operator approved the recommended payment recovery action.",
      "Approval"
    );
  };

  const runAction = () => {
    if (actionExecuted) return;

    if (approvalRequired && !approved) {
      setActiveTab("approvals");
      return;
    }

    setWorkflowRunning(true);
    setWorkflowStep(4);

    setActions((current) =>
      current.map((action) =>
        action.id === "ACT-7841"
          ? { ...action, status: "Executed" }
          : action
      )
    );

    setExecutedCount((current) => current + 1);
    setActionExecuted(true);

    addActivity(
      "Action executed",
      "Payment recovery notification was executed after human approval.",
      "Action"
    );

    setTimeout(() => {
      setWorkflowStep(5);
      setWorkflowRunning(false);
      setOutcomeRecorded(true);
      setOutcomesCount((current) => current + 1);

      setOutcomeMessage(
        "Action completed successfully. Outcome tracking has started."
      );

      addActivity(
        "Outcome tracking started",
        "The action is now traceable for recovery and business impact measurement.",
        "Outcome"
      );
    }, 1000);
  };

  const resetWorkflow = () => {
    setWorkflowStep(0);
    setWorkflowRunning(false);
    setApprovalRequired(false);
    setApproved(false);
    setActionExecuted(false);
    setOutcomeRecorded(false);
    setOutcomeMessage("");

    setActions(initialActions);

    addActivity(
      "Workflow reset",
      "ActionMate is ready for another operational workflow.",
      "System"
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validType =
      file.name.toLowerCase().endsWith(".csv") ||
      file.name.toLowerCase().endsWith(".json");

    if (!validType) {
      setFileStatus("Please upload a CSV or JSON dataset.");
      setFileName("");
      return;
    }

    setFileName(file.name);
    setFileStatus("Dataset received · Demo analysis ready");

    addActivity(
      "Dataset received",
      `${file.name} is ready for synthetic operational analysis.`,
      "Data"
    );
  };

  const renderWorkflowStatus = () => {
    if (workflowStep === 0) {
      return {
        label: "Ready to analyze",
        className: "ready",
      };
    }

    if (workflowStep === 1) {
      return {
        label: "AI teammate understanding context",
        className: "working",
      };
    }

    if (workflowStep === 2) {
      return {
        label: "AI teammate making a decision",
        className: "working",
      };
    }

    if (workflowStep === 3 && approvalRequired) {
      return {
        label: "Waiting for human approval",
        className: "approval",
      };
    }

    if (workflowStep === 3 && approved) {
      return {
        label: "Approved · Ready to execute",
        className: "approval",
      };
    }

    if (workflowStep === 4) {
      return {
        label: "Executing approved action",
        className: "working",
      };
    }

    if (workflowStep === 5) {
      return {
        label: "Outcome recorded",
        className: "success",
      };
    }

    return {
      label: "Ready to analyze",
      className: "ready",
    };
  };

  const workflowStatus = renderWorkflowStatus();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">ACTIONMATE</div>
            <div className="brand-subtitle">
              AI OPERATIONS
              <br />
              PLATFORM
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <NavItem
            label="Command Center"
            active={activeTab === "command"}
            onClick={() => setActiveTab("command")}
            icon="⌘"
          />

          <NavItem
            label="Signals"
            active={activeTab === "signals"}
            onClick={() => setActiveTab("signals")}
            icon="◉"
            badge="4"
          />

          <NavItem
            label="Actions"
            active={activeTab === "actions"}
            onClick={() => setActiveTab("actions")}
            icon="↗"
          />

          <NavItem
            label="Approvals"
            active={activeTab === "approvals"}
            onClick={() => setActiveTab("approvals")}
            icon="✓"
          />

          <NavItem
            label="Data Intelligence"
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
            icon="◈"
          />

          <NavItem
            label="Activity"
            active={activeTab === "activity"}
            onClick={() => setActiveTab("activity")}
            icon="≡"
          />

          <NavItem
            label="Outcomes"
            active={activeTab === "outcomes"}
            onClick={() => setActiveTab("outcomes")}
            icon="↗"
          />
        </nav>

        <div className="sidebar-bottom">
          <div className="environment-card">
            <div className="environment-dot" />

            <div>
              <div className="environment-title">DEMO ENVIRONMENT</div>
              <div className="environment-text">Synthetic data</div>
            </div>
          </div>

          <div className="sidebar-footer">
            ActionMate AI
            <span>v0.1 Demo</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-label">PAYTM</span>
            <span className="topbar-divider">/</span>
            <span>Autonomous Operations</span>
          </div>

          <div className="topbar-right">
            <div className="live-status">
              <span className="live-dot" />
              AI teammate active
            </div>

            <div className="user-avatar">RV</div>
          </div>
        </header>

        {activeTab === "command" && (
          <>
            <section className="page-header">
              <div>
                <div className="eyebrow">OPERATIONS / AI COMMAND CENTER</div>

                <h1>Merchant Operations</h1>

                <p>
                  Resolve high-impact operational issues through continuous
                  signal detection and controlled AI execution.
                </p>
              </div>

              <div className={`header-status ${workflowStatus.className}`}>
                <span className="status-dot" />
                {workflowStatus.label}
              </div>
            </section>

            <section className="kpi-grid">
              <MiniKPI
                label="ACTIVE SIGNALS"
                value="04"
                meta="↑ 2 detected today"
              />

              <MiniKPI
                label="AI DECISIONS"
                value={aiDecisions}
                meta="Across 6 operational areas"
              />

              <MiniKPI
                label="ACTIONS EXECUTED"
                value={executedCount}
                meta="87% completed successfully"
              />

              <MiniKPI
                label="OUTCOMES TRACKED"
                value={outcomesCount}
                meta="Every action traceable"
              />
            </section>

            <section className="command-workspace">
              <div className="workflow-card">
                <div className="card-header">
                  <div>
                    <div className="card-eyebrow">FEATURED WORKFLOW</div>
                    <h2>Payment Recovery</h2>
                  </div>

                  <span className="priority-badge">HIGH PRIORITY</span>
                </div>

                <div className="workflow-intro">
                  <div className="signal-indicator">
                    <span className="signal-dot" />
                    <span>Signal detected</span>
                  </div>

                  <p>
                    Sales are down 24% versus the recent baseline while payment
                    failures have increased.
                  </p>
                </div>

                <div className="workflow">
                  <WorkflowStep
                    number="01"
                    title="UNDERSTAND"
                    text={
                      workflowStep >= 1
                        ? "Context analyzed"
                        : "Read business context"
                    }
                    active={workflowStep === 1}
                    complete={workflowStep > 1}
                  />

                  <WorkflowStep
                    number="02"
                    title="DECIDE"
                    text={
                      workflowStep >= 2
                        ? "Next-best action selected"
                        : "Choose next-best action"
                    }
                    active={workflowStep === 2}
                    complete={workflowStep > 2}
                  />

                  <WorkflowStep
                    number="03"
                    title="ACT"
                    text={
                      actionExecuted
                        ? "Action executed"
                        : approved
                        ? "Approved for execution"
                        : "Execute approved work"
                    }
                    active={workflowStep === 3 || workflowStep === 4}
                    complete={workflowStep > 4}
                  />

                  <WorkflowStep
                    number="04"
                    title="MEASURE"
                    text={
                      outcomeRecorded
                        ? "Outcome recorded"
                        : "Track business outcome"
                    }
                    active={workflowStep === 5}
                    complete={workflowStep === 5}
                  />
                </div>

                <div className="decision-panel">
                  <div className="decision-top">
                    <div>
                      <div className="decision-label">ACTIONMATE DECISION</div>

                      <div className="confidence">
                        <span className="ai-pulse" />
                        94% confidence
                      </div>
                    </div>

                    <div className="decision-stage">
                      {workflowStep === 1 && "UNDERSTANDING"}
                      {workflowStep === 2 && "DECIDING"}
                      {workflowStep === 3 && "APPROVAL"}
                      {workflowStep === 4 && "EXECUTING"}
                      {workflowStep === 5 && "MEASURING"}
                      {workflowStep === 0 && "READY"}
                    </div>
                  </div>

                  <h3>Address payment failure + notify merchant</h3>

                  <p className="decision-reasoning">
                    Transaction failure patterns correlate with the observed
                    sales decline. ActionMate recommends addressing payment
                    friction and notifying the affected merchant.
                  </p>

                  <div className="reasoning-trail">
                    <div className="reasoning-title">WHY THIS ACTION?</div>

                    <div className="reasoning-item">
                      <span>01</span>
                      <div>
                        <strong>Signal correlation</strong>
                        <p>
                          Sales are 24% below baseline while payment failures
                          increased by 18%.
                        </p>
                      </div>
                    </div>

                    <div className="reasoning-item">
                      <span>02</span>
                      <div>
                        <strong>Context check</strong>
                        <p>
                          Transaction and analytics signals point toward
                          payment friction as the immediate issue.
                        </p>
                      </div>
                    </div>

                    <div className="reasoning-item">
                      <span>03</span>
                      <div>
                        <strong>Recommended response</strong>
                        <p>
                          Address payment friction and notify the affected
                          merchant before broader intervention.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="decision-actions">
                    <button
                      className="primary-button"
                      onClick={runAction}
                      disabled={
                        workflowRunning ||
                        (approvalRequired && !approved) ||
                        actionExecuted
                      }
                    >
                      {outcomeRecorded
                        ? "Action Completed"
                        : actionExecuted
                        ? "Action Executed"
                        : approved
                        ? "Execute Approved Action"
                        : approvalRequired
                        ? "Approval Required"
                        : "Execute Action"}
                    </button>

                    <button
                      className="secondary-button"
                      onClick={simulateWorkflow}
                      disabled={workflowRunning}
                    >
                      {workflowRunning
                        ? "AI Teammate Working..."
                        : "Simulate AI Workflow"}
                    </button>

                    {workflowStep > 0 && (
                      <button
                        className="secondary-button reset-button"
                        onClick={resetWorkflow}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {approvalRequired && !approved && (
                    <div className="workflow-notice">
                      <strong>Human approval required.</strong>
                      <span>
                        This action is classified as an important operational
                        decision.
                      </span>

                      <button
                        className="inline-action"
                        onClick={approveAction}
                      >
                        Review & Approve
                      </button>
                    </div>
                  )}

                  {approved && !actionExecuted && (
                    <div className="workflow-notice approval-notice">
                      <strong>Approval received.</strong>
                      <span>
                        ActionMate is ready to execute the authorized action.
                      </span>
                    </div>
                  )}

                  {outcomeRecorded && (
                    <div className="workflow-success">
                      <div className="success-mark">✓</div>

                      <div>
                        <strong>ACTION COMPLETED</strong>
                        <p>
                          Payment recovery notification executed successfully.
                          Outcome tracking has started.
                        </p>
                      </div>

                      <div className="outcome-tag">TRACKING</div>
                    </div>
                  )}

                  <div className="decision-metrics">
                    <div>
                      <span>Sales variance</span>
                      <strong>-24%</strong>
                    </div>

                    <div>
                      <span>Failure trend</span>
                      <strong>+18%</strong>
                    </div>

                    <div>
                      <span>Priority</span>
                      <strong>High</strong>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="context-panel">
                <div className="context-header">
                  <div>
                    <div className="card-eyebrow">AI TEAMMATE</div>
                    <h3>Context understood</h3>
                  </div>

                  <span className="online-label">
                    <span className="online-dot" />
                    ONLINE
                  </span>
                </div>

                <p className="context-description">
                  ActionMate combines operational signals before recommending
                  and executing an action.
                </p>

                <div className="context-list">
                  <ContextItem
                    label="TRANSACTIONS"
                    value="Payment success / failure"
                    active={workflowStep >= 1}
                  />

                  <ContextItem
                    label="MERCHANT"
                    value="Profile, segment, history"
                    active={workflowStep >= 1}
                  />

                  <ContextItem
                    label="SUPPORT + CRM"
                    value="Cases and complaints"
                    active={workflowStep >= 1}
                  />

                  <ContextItem
                    label="ANALYTICS"
                    value="Signals and trends"
                    active={workflowStep >= 1}
                  />
                </div>

                <div className="policy-box">
                  <div className="policy-title">EXECUTION POLICY</div>

                  <div className="policy-row">
                    <span className="policy-dot auto" />
                    <div>
                      <strong>AUTO</strong>
                      <span>Routine work</span>
                    </div>
                  </div>

                  <div className="policy-row">
                    <span className="policy-dot approval" />
                    <div>
                      <strong>APPROVAL</strong>
                      <span>Important decisions</span>
                    </div>
                  </div>

                  <div className="policy-row">
                    <span className="policy-dot escalate" />
                    <div>
                      <strong>ESCALATE</strong>
                      <span>Expert judgment</span>
                    </div>
                  </div>
                </div>
              </aside>
            </section>

            <section className="bottom-grid">
              <PageSection
                title="LATEST SIGNALS"
                eyebrow="What ActionMate sees"
                button="View all →"
                onClick={() => setActiveTab("signals")}
              >
                <div className="signal-list">
                  {initialSignals.map((signal) => (
                    <SignalRow key={signal.title} {...signal} />
                  ))}
                </div>
              </PageSection>

              <PageSection
                title="ACTION QUEUE"
                eyebrow="Next-best actions"
                button="View all →"
                onClick={() => setActiveTab("actions")}
              >
                <div className="action-list">
                  {actions.map((action) => (
                    <ActionRow key={action.id} {...action} />
                  ))}
                </div>
              </PageSection>
            </section>

            <div className="demo-disclaimer">
              Hackathon concept · Synthetic data · Not connected to Paytm
              production systems
            </div>
          </>
        )}

        {activeTab === "signals" && (
          <SignalsPage
            signals={initialSignals}
            onBack={() => setActiveTab("command")}
          />
        )}

        {activeTab === "actions" && (
          <ActionsPage
            actions={actions}
            onBack={() => setActiveTab("command")}
            onExecute={() => setActiveTab("approvals")}
          />
        )}

        {activeTab === "approvals" && (
          <ApprovalsPage
            approvalRequired={approvalRequired}
            approved={approved}
            onApprove={approveAction}
            onExecute={runAction}
            onBack={() => setActiveTab("command")}
          />
        )}

        {activeTab === "data" && (
          <DataIntelligencePage
            fileName={fileName}
            fileStatus={fileStatus}
            onUpload={handleFileUpload}
            onBack={() => setActiveTab("command")}
          />
        )}

        {activeTab === "activity" && (
          <ActivityPage
            activities={activities}
            onBack={() => setActiveTab("command")}
          />
        )}

        {activeTab === "outcomes" && (
          <OutcomesPage
            outcomeRecorded={outcomeRecorded}
            outcomesCount={outcomesCount}
            onBack={() => setActiveTab("command")}
          />
        )}
      </main>
    </div>
  );
}

function NavItem({ label, active, onClick, icon, badge }) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>

      {badge && <span className="nav-badge">{badge}</span>}
    </button>
  );
}

function WorkflowStep({ number, title, text, active, complete }) {
  return (
    <div
      className={`workflow-step ${
        active ? "active" : ""
      } ${complete ? "complete" : ""}`}
    >
      <div className="step-number">{complete ? "✓" : number}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function ContextItem({ label, value, active }) {
  return (
    <div className="context-item">
      <div className={`context-check ${active ? "active" : ""}`}>✓</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function SignalRow({ title, description, priority, time }) {
  return (
    <div className="signal-row">
      <div className="signal-icon" />

      <div className="signal-row-content">
        <strong>{title}</strong>

        <p>{description}</p>

        <div className="signal-row-meta">
          <span className={`priority-text ${priority.toLowerCase()}`}>
            {priority}
          </span>

          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ title, category, mode, status }) {
  return (
    <div className="action-row">
      <div>
        <strong>{title}</strong>

        <div className="action-row-meta">
          <span>{category}</span>
          <span>{mode}</span>
        </div>
      </div>

      <span
        className={`status-pill ${
          status.toLowerCase() === "executed" ? "success" : "ready"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function PageSection({ title, eyebrow, button, onClick, children }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <div className="card-eyebrow">{eyebrow}</div>
          <h3>{title}</h3>
        </div>

        <button className="text-button" onClick={onClick}>
          {button}
        </button>
      </div>

      {children}
    </section>
  );
}

function MiniKPI({ label, value, meta }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-meta">{meta}</div>
    </div>
  );
}

function GovernanceItem({ number, title, text }) {
  return (
    <div className="governance-item">
      <div className="governance-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SignalsPage({ signals, onBack }) {
  return (
    <>
      <PageHeader
        eyebrow="SIGNAL MONITORING"
        title="Operational Signals"
        description="Monitor business signals that may require AI-assisted action."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="section-kpis">
          <MiniKPI label="ACTIVE SIGNALS" value="04" meta="2 new today" />
          <MiniKPI label="HIGH PRIORITY" value="02" meta="Require attention" />
          <MiniKPI label="MONITORED AREAS" value="06" meta="Across operations" />
        </div>

        <div className="table-card">
          <div className="table-header">
            <span>Signal</span>
            <span>Description</span>
            <span>Priority</span>
            <span>Detected</span>
          </div>

          {signals.map((signal) => (
            <div className="table-row" key={signal.title}>
              <strong>{signal.title}</strong>
              <span>{signal.description}</span>
              <span className={`priority-text ${signal.priority.toLowerCase()}`}>
                {signal.priority}
              </span>
              <span>{signal.time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ActionsPage({ actions, onBack, onExecute }) {
  return (
    <>
      <PageHeader
        eyebrow="ACTION ORCHESTRATION"
        title="Action Queue"
        description="Review, authorize and track AI-generated operational actions."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="action-banner">
          <div>
            <div className="card-eyebrow">AI OPERATIONS</div>
            <h2>Next-best actions</h2>
            <p>
              Every recommendation is assigned an execution policy before work
              is performed.
            </p>
          </div>
        </div>

        <div className="action-grid">
          {actions.map((action) => (
            <div className="large-action-card" key={action.id}>
              <div className="action-card-top">
                <span className="action-id">{action.id}</span>
                <span className="mode-pill">{action.mode}</span>
              </div>

              <h3>{action.title}</h3>

              <p>{action.category}</p>

              <div className="action-card-bottom">
                <span
                  className={`state-pill ${
                    action.status === "Executed" ? "success" : "ready"
                  }`}
                >
                  {action.status}
                </span>

                {action.status === "Ready" && (
                  <button className="text-button" onClick={onExecute}>
                    Review →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ApprovalsPage({
  approvalRequired,
  approved,
  onApprove,
  onExecute,
  onBack,
}) {
  return (
    <>
      <PageHeader
        eyebrow="HUMAN OVERSIGHT"
        title="Approvals"
        description="Keep people in control of important operational decisions."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="approval-layout">
          <div className="approval-main">
            <div className="approval-card featured">
              <div className="approval-status">
                {approved
                  ? "APPROVED"
                  : approvalRequired
                  ? "AWAITING APPROVAL"
                  : "READY"}
              </div>

              <div className="card-eyebrow">ACT-7841 · PAYMENT RECOVERY</div>

              <h2>Address payment failure + notify merchant</h2>

              <p>
                ActionMate identified a relationship between increased payment
                failures and the observed sales decline.
              </p>

              <div className="approval-details">
                <div>
                  <span>Confidence</span>
                  <strong>94%</strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>High</strong>
                </div>

                <div>
                  <span>Policy</span>
                  <strong>Human approval</strong>
                </div>
              </div>

              <div className="approval-buttons">
                {!approved && (
                  <button className="primary-button" onClick={onApprove}>
                    Approve Action
                  </button>
                )}

                {approved && (
                  <button className="primary-button" onClick={onExecute}>
                    Execute Approved Action
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="governance-card">
            <div className="card-eyebrow">GOVERNANCE</div>

            <h3>Human + AI</h3>

            <GovernanceItem
              number="01"
              title="AUTO"
              text="Routine, low-risk operational work."
            />

            <GovernanceItem
              number="02"
              title="APPROVAL"
              text="Important decisions require authorization."
            />

            <GovernanceItem
              number="03"
              title="ESCALATE"
              text="Sensitive cases move to expert teams."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function DataIntelligencePage({
  fileName,
  fileStatus,
  onUpload,
  onBack,
}) {
  return (
    <>
      <PageHeader
        eyebrow="DATA INTELLIGENCE"
        title="Operational Data"
        description="Provide synthetic or anonymized data for AI-assisted operational analysis."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="analyzer-layout">
          <div className="upload-card">
            <div className="upload-icon">+</div>

            <div className="card-eyebrow">DATASET INPUT</div>

            <h2>Upload operational data</h2>

            <p>
              Add a CSV or JSON dataset containing synthetic or anonymized
              business information.
            </p>

            <label className="upload-button">
              Choose CSV / JSON
              <input
                className="upload-input"
                type="file"
                accept=".csv,.json"
                onChange={onUpload}
              />
            </label>

            {fileName && (
              <div className="selected-file">
                <strong>{fileName}</strong>
                <span>{fileStatus}</span>
              </div>
            )}

            {!fileName && fileStatus && (
              <div className="selected-file">
                <span>{fileStatus}</span>
              </div>
            )}
          </div>

          <div className="intelligence-results">
            <div className="result-card">
              <div className="card-eyebrow">ANALYSIS PREVIEW</div>

              <h3>Signals ActionMate can surface</h3>

              <div className="analysis-preview">
                <div>
                  <strong>Payment friction</strong>
                  <span>Failure patterns above baseline</span>
                </div>

                <div>
                  <strong>Merchant follow-up</strong>
                  <span>Unresolved interactions detected</span>
                </div>

                <div>
                  <strong>Behavior shift</strong>
                  <span>Recent activity differs from baseline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ActivityPage({ activities, onBack }) {
  return (
    <>
      <PageHeader
        eyebrow="AUDIT TRAIL"
        title="Activity"
        description="Every AI decision and operational action is traceable."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="timeline-card">
          {activities.map((activity, index) => (
            <div className="timeline-item" key={`${activity.time}-${index}`}>
              <div className="timeline-time">{activity.time}</div>

              <div className="timeline-marker">
                <span />
              </div>

              <div className="timeline-content">
                <div className="timeline-type">{activity.type}</div>

                <strong>{activity.title}</strong>

                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function OutcomesPage({ outcomeRecorded, outcomesCount, onBack }) {
  return (
    <>
      <PageHeader
        eyebrow="OUTCOME MEASUREMENT"
        title="Outcomes"
        description="Measure what happens after ActionMate takes action."
        onBack={onBack}
      />

      <section className="page-section-content">
        <div className="outcome-grid">
          <div className="outcome-card">
            <div className="card-eyebrow">OUTCOMES TRACKED</div>
            <strong>{outcomesCount}</strong>
            <span>Every action traceable</span>
          </div>

          <div className="outcome-card">
            <div className="card-eyebrow">RESPONSE TIME</div>
            <strong>70%</strong>
            <span>Illustrative pilot target</span>
          </div>

          <div className="outcome-card">
            <div className="card-eyebrow">MISSED FOLLOW-UPS</div>
            <strong>-30%</strong>
            <span>Illustrative pilot target</span>
          </div>
        </div>

        <div className="outcome-panel">
          <div>
            <div className="card-eyebrow">MEASUREMENT LOOP</div>

            <h2>
              {outcomeRecorded
                ? "Action outcome is now being tracked."
                : "Every action becomes measurable."}
            </h2>

            <p>
              ActionMate connects execution back to business outcomes so teams
              can understand whether an intervention created measurable impact.
            </p>
          </div>

          <div className="measurement-loop">
            <span>Signal</span>
            <b>→</b>
            <span>Decision</span>
            <b>→</b>
            <span>Action</span>
            <b>→</b>
            <span>Outcome</span>
          </div>
        </div>
      </section>
    </>
  );
}

function PageHeader({ eyebrow, title, description, onBack }) {
  return (
    <section className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <button className="secondary-button" onClick={onBack}>
        Back to Command Center
      </button>
    </section>
  );
}

export default App;