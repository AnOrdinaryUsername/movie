import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Modal,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import Link from 'next/link';

import type { GetServerSidePropsContext } from 'next';
import type { MovieInfo, Genre } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface Review {
  id: string;
  user: number;
  movie: string;
  content: string;
}

interface User {
  username: string;
  id: number;
}

interface Props extends MovieInfo {
  movie_id: string;
  user: User;
  reviews: Array<Review>;
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
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [text, setText] = useState('');

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

  async function submitReview() {
    const token = sessionStorage.getItem('token');
    console.log(user);

    if (token !== null && user !== null) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      };

      const body = {
        user: user.id,
        movie: movie_id,
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
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
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
              <Stack pl={rem(40)}>
                <Title order={1} pt={rem(16)}>
                  {media_title}
                </Title>
                {genres.map(({ name }: Partial<Genre>, i: number) => (
                  <Badge autoContrast key={i}>
                    {name}
                  </Badge>
                ))}
                <Text>{media_length} hours</Text>
                <Text>{media_description}</Text>
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
                  <Title order={3} pt={rem(16)}>
                    {actor.name}
                  </Title>
                  <Text>Born on {actor.birthday}</Text>
                  <Text>{actor.description}</Text>
                </Card>
              </Stack>
            ))}
          </Group>
          <Group justify="space-between" w="100%" pb={rem(16)}>
            <Title order={2}>Reviews</Title>
            {user && <Button onClick={open}>Write a Review</Button>}
          </Group>
        </Stack>
        <Stack>
          {reviews &&
            reviews.map((review) => (
              <Stack key={review.id}>
                <Card p={rem(16)} radius="md" w="100%">
                  <Title order={3} pt={rem(16)}>
                    {review.user}
                  </Title>
                  <Text>{review.content}</Text>
                </Card>
              </Stack>
            ))}
        </Stack>
        <Modal centered opened={opened} onClose={close} title="My Review">
          <Stack>
            <Textarea
              resize="vertical"
              label="Review"
              placeholder="This movie is amazing!"
              value={text}
              onChange={(event) => setText(event.currentTarget.value)}
            />
            <Button onClick={submitReview} mt={rem(24)}>
              Submit
            </Button>
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

  try {
    const movieReviews = await fetch(`http://localhost:8000/api/v1/movies/${id}/reviews`);

    if (!movieReviews.ok) {
      throw new Error('Reviews did not return a 200 response');
    }

    reviews = await movieReviews.json();
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
      movie_id: id,
    },
  };
}
