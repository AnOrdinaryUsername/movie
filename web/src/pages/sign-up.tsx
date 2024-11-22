import {
  Alert,
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
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

import GenericLayout from '@/components/Layouts';
import type { AccountCreationFailure, LoginToken } from '@/types';
import { useRouter } from 'next/router';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<AccountCreationFailure | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      username: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  function capitalizeFirstLetter(sentence: string) {
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  function hideError() {
    setError(null);
  }

  async function signUp() {
    const { email, username, password } = form.values;

    const credentials = JSON.stringify({
      email,
      username,
      password,
    });

    console.log(credentials);

    const newUser = await fetch('http://localhost:8000/api/v1/auth/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: credentials,
    });

    try {
      if (newUser.status === 400) {
        const errorResponse: AccountCreationFailure = await newUser.json();
        setError(errorResponse);
        throw new Error('Bad Request');
      }

      console.log(`Created USER: ${username}`);

      const token = await fetch('http://localhost:8000/api/v1/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      });

      if (!token.ok) {
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
    <GenericLayout pageTitle="Sign Up" size="lg" bg="#dce4f5">
      <Header hideButtons />
      <Center>
        <Stack
          bg="var(--mantine-color-white)"
          w="100%"
          maw={rem(550)}
          mih={rem(550)}
          p={rem(75)}
          style={{
            borderRadius: rem(16),
            border:
              '1px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-4))',
          }}
        >
          <form onSubmit={form.onSubmit(signUp)}>
            <Stack justify="center">
              <Title order={1}>Create an Account</Title>
              <TextInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Username"
                placeholder="my_unique_name"
                type="text"
                {...form.getInputProps('username')}
              />
              <TextInput
                withAsterisk
                maw={rem(400)}
                width={'100%'}
                label="Email"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
                {...form.getInputProps('email')}
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
                  Sign Up
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
                {error.email && (
                  <Text component="span">
                    Email error(s):
                    {error.email.map((err, i) => (
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
            Already have an account?{' '}
            <Anchor underline="always" component={Link} href="/log-in">
              Log In
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </GenericLayout>
  );
}
