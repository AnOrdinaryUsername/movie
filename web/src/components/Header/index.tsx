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
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import Link from 'next/link';

const links = [
  { link: '/movies', label: 'Movies' },
  { link: '/resources', label: 'Resources' },
  { link: '/contact-us', label: 'Contact' },
];

interface Props {
  hideButtons?: boolean;
}

export default function Header({ hideButtons }: Props) {
  const [opened, { toggle, close }] = useDisclosure(false);

  const items = links.map((link) => (
    <Anchor key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Anchor>
  ));

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
  );
}
