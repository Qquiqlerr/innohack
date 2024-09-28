import { Card, Flex, Text } from "@gravity-ui/uikit";
import React from "react";

import { FlatTask, KanbanCard } from "./KanbanCard/KanbanCard";
import styles from "./KanbanList.module.css";

interface KanbanListProps {
  name: string;
  flatTasks: FlatTask[];
}

export const KanbanList: React.FC<KanbanListProps> = ({ name, flatTasks }) => {
  return (
    <Card view="outlined">
      <Flex direction="column" gap="4" className={styles.wrapper}>
        <Text variant="display-2">{name}</Text>
        <Flex gap="4" direction="column">
          {flatTasks.map((task) => (
            <KanbanCard key={`${task.project_id}_${task.id}`} {...task} />
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};
