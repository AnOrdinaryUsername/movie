import {
  Anchor,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  Stack,
  Menu,
  UnstyledButton,
  Text,
  rem,
  Avatar,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Spotlight, SpotlightActionData, spotlight } from '@mantine/spotlight';

import classes from './Header.module.css';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IconChevronDown, IconLogout, IconSearch, IconSettings } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { User } from '@/types';

const links = [
  { link: '/movies', label: 'Movies' },
  { link: '/resources', label: 'Resources' },
  { link: '/contact-us', label: 'Contact' },
];

const authLinks = [
  { link: '/movies', label: 'Movies' },
  { link: '/favorites', label: 'Favorites' },
  { link: '/watch-list', label: 'Watch List' },
];

interface Props {
  hideButtons?: boolean;
}

interface AuthHeaderProps {
  user: User;
}

const actions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    onClick: () => console.log('Home'),
    leftSection: <IconSearch style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    onClick: () => console.log('Dashboard'),
    leftSection: <IconSearch style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
  },
  {
    id: 'documentation',
    label: 'Documentation',
    onClick: () => console.log('Documentation'),
    leftSection: <IconSearch style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
  },
];

function AuthHeader({ user }: AuthHeaderProps) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<SpotlightActionData | []>([]);


  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const authItems = authLinks.map((link) => (
    <Anchor key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Anchor>
  ));

  async function logOut() {
    const token = sessionStorage.getItem('token');
    console.log(token);

    const auth = {
      Authorization: `Token ${token}`,
    };

    const result = await fetch('http://localhost:8000/api/v1/auth/token/logout', {
      method: 'POST',
      headers: new Headers(auth),
    });

    try {
      if (result.status !== 204) {
        throw new Error('Unable to log out. Invalid credentials were provided.');
      }

      sessionStorage.clear();
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Log Out Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  return (
    <>
      <header className={classes.header}>
        <Container size="lg" className={classes.inner}>
          <Group justify="space-between" h="100%" w="100%">
            <Anchor href="/">
              <Image
                fit="contain"
                alt="Reel Reviews"
                h={rem(22)}
                maw={rem(200)}
                w="100%"
                src="/logo.svg"
              />
            </Anchor>
            <Group gap={5} visibleFrom="md">
              {authItems}
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />

            <Spotlight
                query={query}
                onQueryChange={setQuery}
                actions={actions}
                nothingFound="Nothing found..."
                highlightQuery
                limit={5}
                searchProps={{
                  leftSection: (
                    <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                  ),
                  placeholder: 'Search for a movie',
                }}
              />

            <Group visibleFrom='md'>
              <ActionIcon
                variant="transparent"
                color="gray"
                aria-label="Search"
                onClick={spotlight.open}
              >
                <IconSearch style={{ width: '80%', height: '80%' }} stroke={3} />
              </ActionIcon>

              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={`${classes.user} ${userMenuOpened ? classes.userActive : null}`}
                  >
                    <Group gap={7}>
                      <Avatar alt={user.username} radius="xl" />
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {user.username}
                      </Text>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    onClick={() => router.push('/user/settings')}
                  >
                    Account settings
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    onClick={logOut}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </header>

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title={
          <Anchor component={Link} href="/">
            <Image fit="contain" alt="Reel Reviews" maw={rem(200)} w="100%" src="/logo.svg" />
          </Anchor>
        }
        hiddenFrom="md"
        zIndex={100}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Anchor href="/movies" component={Link} className={classes.link}>
            Movies
          </Anchor>
          <Anchor href="/favorites" component={Link} className={classes.link}>
            Favorites
          </Anchor>
          <Anchor href="/watch-list" component={Link} className={classes.link}>
            Watch List
          </Anchor>

          <Divider my="sm" />

          <Group>
            <ActionIcon variant="transparent" color="gray" aria-label="Search">
              <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={`${classes.user} ${userMenuOpened ? classes.userActive : null}`}
                >
                  <Group gap={7}>
                    <Avatar alt={user?.username} radius="xl" />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user.username}
                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => router.push('/user/settings')}
                >
                  Account settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={logOut}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}

export default function Header({ hideButtons }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [opened, { toggle, close }] = useDisclosure(false);

  const items = links.map((link) => (
    <Anchor key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Anchor>
  ));

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token !== null) {
      const auth = {
        Authorization: `Token ${token}`,
      };

      fetch(`http://localhost:8000/api/v1/auth/users/me`, {
        headers: new Headers(auth),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    }
  }, []);

  return (
    <>
      {!user && (
        <>
          <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
              <Group justify="space-between" h="100%" w="100%">
                <Anchor href="/">
                  <Image
                    fit="contain"
                    alt="Reel Reviews"
                    h={rem(22)}
                    maw={rem(200)}
                    w="100%"
                    src="/logo.svg"
                  />
                </Anchor>
                <Group gap={5} visibleFrom="md">
                  {items}
                </Group>
                {!hideButtons && (
                  <>
                    <Group visibleFrom="md">
                      <Button component={Link} variant="subtle" href="/log-in">
                        Log in
                      </Button>
                      <Button component={Link} variant="filled" href="/sign-up">
                        Sign up
                      </Button>
                    </Group>
                  </>
                )}
                <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
              </Group>
            </Container>
          </header>

          <Drawer
            opened={opened}
            onClose={close}
            size="100%"
            padding="md"
            title={
              <Anchor component={Link} href="/">
                <Image fit="contain" alt="Reel Reviews" maw={rem(200)} w="100%" src="/logo.svg" />
              </Anchor>
            }
            hiddenFrom="sm"
            zIndex={100}
          >
            <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
              <Divider my="sm" />

              <Anchor href="/movies" component={Link} className={classes.link}>
                Movies
              </Anchor>
              <Anchor href="/resources" component={Link} className={classes.link}>
                Resources
              </Anchor>
              <Anchor href="/contact-us" component={Link} className={classes.link}>
                Contact Us
              </Anchor>

              <Divider my="sm" />

              <Stack align="stretch" justify="center" pb="xl" px="md">
                <Button component={Link} variant="filled" href="/sign-up">
                  Sign up
                </Button>
                <Button component={Link} variant="light" href="/log-in">
                  Log in
                </Button>
              </Stack>
            </ScrollArea>
          </Drawer>
        </>
      )}
      {user && <AuthHeader user={user} />}
    </>
  );
}
