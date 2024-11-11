import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import {
  Badge,
  Card,
  Container,
  Group,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';

import type { GetServerSidePropsContext } from 'next';
import type { MovieInfo, Genre } from '@/types';

type Props = MovieInfo;

export default function MoviesPage({
  genres,
  actors_list,
  media_title,
  media_length,
  media_description,
  image_url,
}: Props) {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
        <Stack align="flex-start" gap='md'>
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
              <Title order={1} pt={rem(16)}>{media_title}</Title>
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
            <Card component={Link} href={`/actors/${actor.id}`} p={rem(16)} radius="md" w="100%">
              <Image
                src={actor.image_url || 'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'}
                maw={rem(300)}
                radius="md"
              />
              <Title order={3} pt={rem(16)}>{actor.name}</Title>
              <Text>Born on {actor.birthday}</Text>
              <Text>{actor.description}</Text>
            </Card>
          </Stack>
        ))}
        </Group>
        </Stack>
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

  const { genres, actors_list, media_title, media_length, media_description, image_url } = result;

  return {
    props: {
      genres,
      actors_list,
      media_title,
      media_length,
      media_description,
      image_url,
    },
  };
}
