import {
  Button,
  Center,
  Group,
  rem,
  PasswordInput,
  Stack,
  Text,
  Title,
  TextInput,
  Anchor,
  List,
  Alert,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import Header from '@/components/Header';
import Link from 'next/link';

import GenericLayout from '@/components/Layouts';
import { LoginFailure, LoginToken } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<LoginFailure | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  function capitalizeFirstLetter(sentence: string) {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  function hideError() {
    setError(null);
  }

  async function logIn() {
    const { username, password } = form.values;

    const credentials = JSON.stringify({
      username,
      password,
    });

    try {
      const token = await fetch('http://localhost:8000/api/v1/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      });

      if (!token.ok) {
        const errorResponse: LoginFailure = await token.json();
        setError(errorResponse);
        throw new Error('Unable to grab login token');
      }

      const loginToken: LoginToken = await token.json();

      console.log(loginToken.auth_token);

      sessionStorage.setItem('token', loginToken.auth_token);
      router.push('/movies');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <GenericLayout pageTitle="Log In" size="lg" bg="#dce4f5">
      <Header hideButtons />
      <Center>
        <Stack
          bg="var(--mantine-color-white)"
          w="100%"
          maw={rem(550)}
          p={rem(75)}
          style={{
            borderRadius: rem(16),
            border:
              '1px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-4))',
          }}
        >
          <form onSubmit={form.onSubmit(logIn)}>
            <Stack justify="center">
              <Title order={1}>Log In</Title>
              <TextInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Username"
                placeholder="username"
                type="username"
                autoComplete="username"
                {...form.getInputProps('username')}
              />
              <PasswordInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Password"
                placeholder="********"
                type="password"
                autoComplete="current-password"
                {...form.getInputProps('password')}
              />
              <Group mt="md">
                <Button w="100%" type="submit">
                  Log In
                </Button>
              </Group>
            </Stack>
          </form>
          {error && (
            <Alert
              variant="light"
              color="red"
              onClose={hideError}
              withCloseButton
              title="Error"
              icon={<IconInfoCircle />}
            >
              <List>
                {error.non_field_errors && (
                  <Text component="span">
                    Login error(s):
                    {error.non_field_errors.map((err, i) => (
                      <List.Item key={i}>{capitalizeFirstLetter(err)}</List.Item>
                    ))}
                  </Text>
                )}
                {error.username && (
                  <Text component="span">
                    Username error(s):
                    {error.username.map((err, i) => (
                      <List.Item key={i}>{capitalizeFirstLetter(err)}</List.Item>
                    ))}
                  </Text>
                )}
                {error.password && (
                  <Text component="span">
                    Email error(s):
                    {error.password.map((err, i) => (
                      <List.Item key={i}>{capitalizeFirstLetter(err)}</List.Item>
                    ))}
                  </Text>
                )}
              </List>
            </Alert>
          )}
          <Text size="gray" ta="center" mt={rem(16)}>
            Don&apos;t have an account?{' '}
            <Anchor underline="always" component={Link} href="/sign-up">
              Sign Up Now
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </GenericLayout>
  );
}
