import { Button, Card, Container, Flex, RadioButton } from "@gravity-ui/uikit";
import { groupBy } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/store";

import { Project } from "../../../api/fetchers/projectManagerSchemas";
import { KanbanList } from "./../../components/KanbanList/KanbanList";

interface KanbanPageProps {
  goToAuth: () => void;
}

export const KanbanPage: React.FC<KanbanPageProps> = ({ goToAuth }) => {
  const projects = useSelector<RootState>(
    (state) => state.projects.projectsList,
  ) as Project[];

  const isLoading = useSelector<RootState>(
    (state) => state.projects.isLoading,
  ) as boolean;

  const allTasks = projects.flatMap(
    (project) =>
      project?.tasks?.map((task) => ({
        ...task,
        projectData: { name: project.name, id: project.id },
      })) ?? [],
  );

  const ALL_PROJECTS_FILTER = "ALL_u6xkasdkl12asd";

  const [currentProjectId, setCurrentProjectId] = useState(ALL_PROJECTS_FILTER);

  const allTasksGroupedByProject = groupBy(allTasks, "project_id");

  const currentProject =
    currentProjectId !== ALL_PROJECTS_FILTER
      ? allTasksGroupedByProject[currentProjectId]
      : allTasks;

  const allTaksGroupedByStatus = groupBy(currentProject, "status");

  return (
    <Container maxWidth="xl">
      <Flex direction="column" gap="4">
        <Card style={{ padding: "var(--g-spacing-4)" }} view="raised">
          <Flex justifyContent="space-between">
            <RadioButton
              options={[
                {
                  value: ALL_PROJECTS_FILTER,
                  content: "Все проекты",
                },
                ...projects.map((project) => ({
                  value: String(project.id),
                  content: project.name,
                })),
              ]}
              value={String(currentProjectId)}
              onUpdate={(value) => {
                setCurrentProjectId(value);
              }}
            />
            <Button onClick={goToAuth}>Выйти</Button>
          </Flex>
        </Card>
        <Flex gap="8">
          <KanbanList
            name="Ожидает"
            flatTasks={allTaksGroupedByStatus[0] ?? []}
          />
          <KanbanList
            name="В работе"
            flatTasks={allTaksGroupedByStatus[1] ?? []}
          />
          <KanbanList
            name="Выполнена"
            flatTasks={allTaksGroupedByStatus[2] ?? []}
          />
        </Flex>
      </Flex>
    </Container>
  );
};
