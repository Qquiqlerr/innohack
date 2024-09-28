import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store/store";

import styles from "./AuthPage.module.css";

interface AuthPageProps {
  login: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ login }) => {
  // const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container maxWidth="m" className={styles.container}>
      <Card view="raised" className={styles.authCard}>
        <Flex direction="column" gap="4">
          <Text variant="display-1">Аутентификация</Text>
          <div>
            <TextInput label="E-mail" hasClear={true} />
          </div>
          <div>
            <TextInput label="Password" hasClear={true} />
          </div>
          <Flex gap="4">
            <Button view="action" onClick={login}>
              Войти
            </Button>
            <Button>Регистрация</Button>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
};
