import { ArrowLeft, ArrowRight } from "@gravity-ui/icons";
import { Button, Card, Flex, Icon, Label, Text } from "@gravity-ui/uikit";
import React from "react";

import { Task } from "../../../../api/fetchers/projectManagerSchemas";
import { updateTaskData } from "../../../store/slices/projectThunks";
import styles from "./KanbanCard.module.css";

export type FlatTask = {
  showProjectName?: boolean;
  projectData?: {
    name?: string;
    id?: number;
  };
} & Task;

type KanbanCardProps = FlatTask;

export const KanbanCard: React.FC<KanbanCardProps> = ({
  showProjectName,
  projectData,
  name,
  status,
  id,
}) => {
  if (id === undefined || status === undefined) {
    throw new Error("Task [id, status] are required");
  }

  const move = (newStatus: number) => {
    updateTaskData({ taskId: id, newStatus });
  };

  return (
    <Card className={styles.wrapper}>
      <Flex justifyContent="space-between">
        <Flex direction="column" gap="4">
          <Text>{name}</Text>
          {showProjectName && (
            <div>
              <Label>
                <Text>{projectData?.name}</Text>
              </Label>
            </div>
          )}
        </Flex>
        <Flex direction="column" gap="2">
          <Button disabled={status === 0} onClick={() => move(status - 1)}>
            <Icon data={ArrowLeft} />
          </Button>
          <Button disabled={status === 2} onClick={() => move(status + 1)}>
            <Icon data={ArrowRight} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
