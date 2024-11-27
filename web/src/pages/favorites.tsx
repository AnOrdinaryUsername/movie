import Header from '@/components/Header';
import Link from 'next/link';

import GenericLayout from '@/components/Layouts';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import { MovieInfo, User } from '@/types';
import {
  ActionIcon,
  Card,
  Container,
  Group,
  Image,
  Menu,
  rem,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<MovieInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem('token');

      if (!token) {
        router.push('/log-in');
        return;
      }

      const auth = {
        Authorization: `Token ${token}`,
      };

      let result = await fetch(`http://localhost:8000/api/v1/auth/users/me`, {
        headers: new Headers(auth),
      });

      if (!result.ok) {
        router.push('/log-in');
        return;
      }

      const userData: User = await result.json();
      setUser(userData);

      result = await fetch(`http://localhost:8000/api/v1/users/${userData.id}/favorites`);

      if (result.ok) {
        const favorites: MovieInfo[] = await result.json();
        setFavorites(favorites);
        setIsLoading(false);
      } else {
        setError('Unable to fetch favorites. Please try again later.');
        setIsLoading(false);
      }
    })();
  }, []);

  async function removeMovie(event: MouseEvent<HTMLButtonElement>) {
    if (!user || !favorites) {
      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Fetch Error',
        message: `Unable to get favorites.`,
        color: 'red',
        loading: false,
      });
      return;
    }

    const { id } = event.currentTarget;
    const { media_title } = favorites.filter((movie) => movie.id === id)[0];

    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };

    const result = await fetch(`http://localhost:8000/api/v1/users/${user.id}/favorites`, {
      method: 'DELETE',
      headers: new Headers(headers),
      body: JSON.stringify({
        movie_id: event.currentTarget.id,
      }),
    });

    try {
      if (result.status !== 204) {
        throw new Error(
          `Unable to remove ${media_title} from favorites. Please try again at a later time.`,
        );
      }

      setFavorites(favorites.filter((movie) => movie.id !== id));

      notifications.show({
        withCloseButton: true,
        autoClose: 30000,
        title: 'Deleted',
        message: `Removed ${media_title} from favorites.`,
        color: 'yellow',
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 30000,
          title: 'Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  return (
    <GenericLayout pageTitle="Log In" size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
        <Title mb={rem(24)} order={1}>
          Favorites
        </Title>
        <Stack align="flex-start" gap="md">
          {error && <Text>{error}</Text>}

          {isLoading && <Skeleton height={50} />}

          {favorites.length === 0 && <Text fw={500}>You have no favorite movies.</Text>}

          {favorites.length > 0 &&
            favorites.map(({ id, image_url, media_title, media_release_date }) => (
              <Card p={0} radius="md" w="100%" key={id}>
                <Group justify="space-between" align="flex-start">
                  <Group>
                    <Link href={`/movies/${id}`}>
                      <Image
                        src={
                          image_url ||
                          'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'
                        }
                        maw={rem(100)}
                        miw={rem(100)}
                        flex={1}
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      />
                    </Link>
                    <Stack p={rem(16)}>
                      <Title order={2} fw={600}>
                        {media_title}
                      </Title>
                      <Text fw={500}>{new Date(media_release_date).getFullYear().toString()}</Text>
                    </Stack>
                  </Group>

                  <Menu
                    shadow="md"
                    width={130}
                    position="bottom-end"
                    transitionProps={{ transition: 'pop-top-right' }}
                  >
                    <Menu.Target>
                      <ActionIcon
                        size={72}
                        variant="white"
                        color="gray"
                        aria-label="Edit"
                        p={rem(24)}
                      >
                        {<IconDotsVertical stroke={3} />}
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown mt={rem(-24)}>
                      <Menu.Item
                        id={id}
                        color="#a61414"
                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                        onClick={removeMovie}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card>
            ))}
        </Stack>
      </Container>
    </GenericLayout>
  );
}
