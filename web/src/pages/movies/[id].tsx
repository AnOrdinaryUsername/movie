import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Menu,
  Modal,
  rem,
  Stack,
  Text,
  Textarea,
  Title,
  useModalsStack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

import type { GetServerSidePropsContext } from 'next';
import type { MovieInfo, Genre, User } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { ChangeEvent, ChangeEventHandler, MouseEvent, useEffect, useRef, useState } from 'react';
import { convertToReadableTime } from '@/utils';
import {
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconPlayerPlayFilled,
  IconTrash,
} from '@tabler/icons-react';
import { modals, useModals } from '@mantine/modals';
import RichTextEditor from '@/components/RichTextEditor';

interface Review {
  id: string;
  user: User;
  movie: string;
  content: string;
}

interface MistralSuccess {
  message: string;
}

interface MistralFailure {
  error: string;
}

type MistralSummary = MistralSuccess | MistralFailure;

interface Props extends MovieInfo {
  movie_id: string;
  user: User;
  reviews: Array<Review>;
  mistralSummary: MistralSuccess;
}

export default function MoviesPage({
  genres,
  actors_list,
  media_title,
  media_length,
  media_description,
  image_url,
  movie_id,
  reviews,
  mistralSummary
}: Props) {
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const stack = useModalsStack(['editReview', 'createReview']);
  const [userReviews, setUserReviews] = useState<Array<Review> | null>(reviews);
  const [text, setText] = useState('');
  const [userReviewId, setUserReviewId] = useState('');

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem('token');

      if (token !== null) {
        const auth = {
          Authorization: `Token ${token}`,
        };

        let result = await fetch(`http://localhost:8000/api/v1/auth/users/me`, {
          headers: new Headers(auth),
        });

        if (!result.ok) {
          setUser(null);
          return;
        }

        const userData: User = await result.json();
        setUser(userData);
        setText(reviews.find((review) => review.user.id === userData.id)?.content ?? '');

        result = await fetch(`http://localhost:8000/api/v1/users/${userData.id}/favorites`);

        if (result.ok) {
          const favorites = await result.json();

          if (favorites.some(({ id }: { id: string }) => id === movie_id)) {
            setIsFavorite(true);
          }

          result = await fetch(`http://localhost:8000/api/v1/users/${userData.id}/watchlist`);
          const watchlist = await result.json();

          if (result.ok) {
            if (watchlist.some(({ id }: { id: string }) => id === movie_id)) {
              setIsPlanning(true);
            }
          }
        }
      }
    })();
  }, []);

  async function submitReview() {
    const token = sessionStorage.getItem('token');
    console.log(user);

    if (token !== null && user !== null) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      };

      if (text.length === 0) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Submission Error',
          message: 'Cannot submit an empty review.',
          color: 'red',
          loading: false,
        });
        return;
      }

      const body = {
        content: text,
      };

      const newReview = await fetch(`http://localhost:8000/api/v1/movies/${movie_id}/reviews`, {
        method: 'POST',
        headers: new Headers(headers),
        body: JSON.stringify(body),
      });

      try {
        if (newReview.status !== 201) {
          throw new Error('Unable to create a review.');
        }

        console.log(`${user.username} created a review for ${media_title}.`);

        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Success',
          message: `Submitted a review for ${media_title}!`,
          color: 'green',
          loading: false,
        });

        const review: Review = await newReview.json();
        const prevReviews = userReviews ?? [];
        setUserReviews([...prevReviews, review]);

        stack.close('createReview');
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          notifications.show({
            withCloseButton: true,
            autoClose: 5000,
            title: 'Review Error',
            message: error.message,
            color: 'red',
            loading: false,
          });
        }
      }
    }
  }

  async function removeMovie(type: 'favorites' | 'watchlist') {
    if (!user) {
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Not Logged In',
        message: `Please log in to remove movie from ${type}.`,
        color: 'red',
        loading: false,
      });
      return;
    }

    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };

    const result = await fetch(`http://localhost:8000/api/v1/users/${user.id}/${type}`, {
      method: 'DELETE',
      headers: new Headers(headers),
      body: JSON.stringify({
        movie_id,
      }),
    });

    try {
      if (result.status !== 204) {
        throw new Error(
          `Unable to remove ${media_title} from ${type}. Please try again at a later time.`,
        );
      }

      if (type === 'watchlist') {
        setIsPlanning(false);
      } else {
        setIsFavorite(false);
      }

      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Deleted',
        message: `Removed ${media_title} from ${type}.`,
        color: 'yellow',
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  async function addMovie(type: 'favorites' | 'watchlist') {
    if (!user) {
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Not Logged In',
        message: `Please log in to save movie to ${type}.`,
        color: 'red',
        loading: false,
      });
      return;
    }

    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };

    const result = await fetch(`http://localhost:8000/api/v1/users/${user.id}/${type}`, {
      method: 'POST',
      headers: new Headers(headers),
      body: JSON.stringify({
        movie_id,
      }),
    });

    try {
      if (result.status !== 201) {
        throw new Error(
          `Unable to save ${media_title} to ${type}. Please try again at a later time.`,
        );
      }

      if (type === 'watchlist') {
        setIsPlanning(true);
      } else {
        setIsFavorite(true);
      }

      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Success',
        message: `Added ${media_title} to ${type}!`,
        color: 'green',
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  async function deleteReview(id: string) {
    if (!user) {
      return;
    }

    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };

    const result = await fetch(`http://localhost:8000/api/v1/movies/${movie_id}/reviews/${id}`, {
      method: 'DELETE',
      headers: new Headers(headers),
    });

    try {
      if (result.status !== 204) {
        throw new Error(`Unable to delete review. Please try again at a later time.`);
      }

      if (userReviews) {
        setUserReviews(userReviews.filter((movie) => movie.id !== id));
        setText('');
        setUserReviewId('');
      }

      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Deleted',
        message: `Your review has been removed.`,
        color: 'yellow',
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  async function editReview(event: MouseEvent<HTMLButtonElement>) {
    if (!user) {
      return;
    }

    const token = sessionStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };

    const body = {
      content: text,
    };

    const result = await fetch(
      `http://localhost:8000/api/v1/movies/${movie_id}/reviews/${userReviewId}`,
      {
        method: 'PATCH',
        headers: new Headers(headers),
        body: JSON.stringify(body),
      },
    );

    try {
      if (!result.ok) {
        throw new Error(`Unable to update review. Please try again at a later time.`);
      }

      if (userReviews) {
        setUserReviews(
          userReviews.map((review) => {
            if (review.id === userReviewId) {
              return { ...review, content: text };
            } else {
              return review;
            }
          }),
        );
      }

      stack.close('editReview');

      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: 'Updated',
        message: `Your changes have been saved.`,
        color: 'green',
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: 'Error',
          message: error.message,
          color: 'red',
          loading: false,
        });
      }
    }
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.currentTarget.value);
  }

  function openEditModal(id: string) {
    stack.open('editReview');
    setUserReviewId(id);
  }

  function openConfirmModal(id: string) {
    modals.openConfirmModal({
      title: 'Delete Review',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete your review?</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteReview(id),
    });
  }

  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} pb={rem(120)} m={0} maw="100%" mih="100%">
        <Stack align="flex-start" gap="md">
          <Card p={rem(16)} radius="md" w="100%">
            <Group>
              <Image
                src={image_url || 'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'}
                maw={rem(300)}
                miw={rem(300)}
                flex={1}
                radius="md"
              />
              <Stack pl={rem(40)} maw={rem(600)}>
                <Title order={1} pt={rem(16)}>
                  {media_title}
                </Title>
                {genres.map(({ name }: Partial<Genre>, i: number) => (
                  <Badge autoContrast key={i}>
                    {name}
                  </Badge>
                ))}
                <Text>{convertToReadableTime(media_length)}</Text>
                <Text>{media_description}</Text>
                <Group>
                  <ActionIcon
                    onClick={() => (isFavorite ? removeMovie('favorites') : addMovie('favorites'))}
                    size={36}
                    variant="light"
                    color="pink"
                    aria-label="Favorite"
                  >
                    {isFavorite ? <IconHeartFilled stroke={3} /> : <IconHeart stroke={3} />}
                  </ActionIcon>
                  <Button
                    variant="light"
                    onClick={() => (isPlanning ? removeMovie('watchlist') : addMovie('watchlist'))}
                    leftSection={
                      isPlanning ? (
                        <IconCheck size={rem(20)} />
                      ) : (
                        <IconPlayerPlayFilled size={rem(16)} />
                      )
                    }
                  >
                    {isPlanning ? 'Added to Watch List' : 'Add to Watch List'}
                  </Button>
                </Group>
              </Stack>
            </Group>
          </Card>
          <Title order={2}>Actors</Title>
          <Group>
            {actors_list.map((actor) => (
              <Stack key={actor.id}>
                <Card
                  component={Link}
                  href={`/actors/${actor.id}`}
                  p={rem(16)}
                  radius="md"
                  w="100%"
                >
                  <Image
                    src={
                      actor.image_url ||
                      'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'
                    }
                    maw={rem(300)}
                    radius="md"
                  />
                  <Title order={3} pt={rem(16)} ta='center'>
                    {actor.name}
                  </Title>
                </Card>
              </Stack>
            ))}
          </Group>
          <Group justify="space-between" w="100%" pb={rem(16)}>
            <Title order={2}>Reviews</Title>
            {user && (
              <Button onClick={() => stack.open('createReview')} disabled={text !== ''}>
                Write a Review
              </Button>
            )}
          </Group>
        </Stack>
        <Stack>
          <Card>
            <Title order={3}>🤖 AI Reviews Analysis</Title>
            <Text pt={rem(16)}>{mistralSummary.message}</Text>
          </Card>
          {userReviews &&
            userReviews.map((review) => (
              <Stack key={review.id}>
                <Card p={rem(16)} radius="md" w="100%">
                  <Stack>
                    <Group justify="space-between" h={rem(40)}>
                      <Title order={3}>{review.user.username}</Title>
                      {review.user.username === user?.username && (
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
                              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              onClick={() => openEditModal(review.id)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              color="#a61414"
                              leftSection={
                                <IconTrash style={{ width: rem(14), height: rem(14) }} />
                              }
                              onClick={() => openConfirmModal(review.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Group>
                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                  </Stack>
                </Card>
              </Stack>
            ))}
        </Stack>
        <Modal
          {...stack.register('createReview')}
          centered
          onClose={() => stack.close('createReview')}
          title="My Review"
          size="xl"
        >
          <Stack>
            <RichTextEditor value={text} onChange={setText} />
            <Button onClick={submitReview} mt={rem(24)}>
              Submit
            </Button>
          </Stack>
        </Modal>
        <Modal
          {...stack.register('editReview')}
          centered
          onClose={() => stack.close('editReview')}
          title="Edit Review"
          size="xl"
        >
          <Stack>
            <RichTextEditor value={text} onChange={setText} />
            <Group justify="flex-end" mt={rem(24)}>
              <Button variant="light" onClick={() => stack.close('editReview')}>
                Cancel
              </Button>
              <Button onClick={editReview}>Confirm</Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </GenericLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const result: Props = await fetch(`http://localhost:8000/api/v1/movies/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          'There seems to be a problem with the server at the moment. Please try again later.',
        );
      }
      return res.json();
    })
    .catch((error) => {
      console.error(error);
    });

  let reviews: Array<Review> | null = null;
  let mistralSummary: string | null = null;

  try {
    const movieReviews = await fetch(`http://localhost:8000/api/v1/movies/${id}/reviews`);
    const aiSummary = await fetch(`http://localhost:8000/api/v1/movies/${id}/mistral`);

    if (!movieReviews.ok || !aiSummary.ok) {
      throw new Error('Reviews did not return a 200 response');
    }

    reviews = await movieReviews.json();
    mistralSummary = await aiSummary.json();
  } catch (error) {
    console.error(error);
  }

  const { genres, actors_list, media_title, media_length, media_description, image_url } = result;

  return {
    props: {
      genres,
      actors_list,
      media_title,
      media_length,
      media_description,
      image_url,
      reviews,
      mistralSummary,
      movie_id: id,
    },
  };
}
