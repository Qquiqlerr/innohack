import React, { useState } from "react";

import { AuthPage } from "./pages/AuthPage/AuthPage";
import { KanbanPage } from "./pages/KanbanPage/KanbanPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"kanban" | "auth">("kanban");

  return (
    <>
      {currentPage === "kanban" ? (
        <KanbanPage goToAuth={() => setCurrentPage("auth")} />
      ) : (
        <AuthPage login={() => setCurrentPage("kanban")} />
      )}
    </>
  );
}

export default App;
